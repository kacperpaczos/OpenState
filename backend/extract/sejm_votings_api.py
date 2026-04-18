import logging
import concurrent.futures
from typing import Any
from extract.base import BaseApiExtractor
from core.config import SEJM_API_BASE
from core.exceptions import ExtractError

logger = logging.getLogger("ETL_EXTRACT_VOTINGS")


class SejmVotingsExtractor(BaseApiExtractor):
    """
    Multi-level extractor for Sejm voting data.

    Fetches data at 3 levels:
      1. List of sittings: GET /votings
      2. Per-sitting voting index: GET /votings/{sitting}
      3. Per-voting detail + per-person votes: GET /votings/{sitting}/{n}

    Returns a list of sitting dicts, each with a 'votings' list containing
    the full per-person vote detail.

    NOTE: This makes O(sittings * votings_per_sitting) HTTP requests.
    On a full 10th-term dataset this is ~49 * ~100 = ~5000 requests.
    Rate-limit gracefully — errors on individual votings are logged and skipped.
    """

    def __init__(self):
        super().__init__(source_name="sejm_votings", verify_ssl=False)

    def extract(self) -> list[dict]:
        # Step 1 — list of sittings
        sittings_raw = self.fetch_json(f"{SEJM_API_BASE}/votings")
        logger.info(f"Found {len(sittings_raw)} sittings.")

        result = []
        for sitting_info in sittings_raw:
            sitting_num = sitting_info.get("proceeding") or sitting_info.get("sitting") or sitting_info.get("number")
            if not sitting_num:
                continue

            # Normalise date (API may return 'dates' list or single 'date')
            dates = sitting_info.get("dates", [])
            date = dates[0] if dates else sitting_info.get("date", "")

            # Step 2 — list of votings for this sitting
            try:
                sitting_votings = self.fetch_json(f"{SEJM_API_BASE}/votings/{sitting_num}")
            except ExtractError as e:
                logger.warning(f"Sitting {sitting_num}: could not fetch voting index — {e}")
                sitting_votings = []

            def fetch_detail(v):
                voting_num = v.get("votingNumber")
                if not voting_num:
                    return None
                try:
                    detail = self.fetch_json(f"{SEJM_API_BASE}/votings/{sitting_num}/{voting_num}")
                    return {**v, **detail, "sitting": sitting_num}
                except ExtractError as e:
                    logger.warning(f"  Voting {sitting_num}/{voting_num}: could not fetch detail — {e}")
                    return {**v, "sitting": sitting_num, "votes": []}

            # Step 3 — parallel detail fetch
            logger.info(f"Sitting {sitting_num}: Fetching details for {len(sitting_votings)} votings in parallel (5 threads)...")
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                full_votings = list(filter(None, executor.map(fetch_detail, sitting_votings)))

            logger.info(f"Sitting {sitting_num}: fetched {len(full_votings)} votings.")
            result.append({
                "sitting": sitting_num,
                "date": date,
                "dates": dates,
                "votings": full_votings,
            })

        self._save_raw_cache(result, "votings_full")
        return result
