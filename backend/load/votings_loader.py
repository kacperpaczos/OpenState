from typing import Any
from pathlib import Path
import logging
from load.file_loader import FileLoader
from core.config import PUBLIC_DATA_DIR
from core.exceptions import LoadError

logger = logging.getLogger("ETL_LOAD_VOTINGS")


class VotingsLoader:
    """
    Saves all voting data in the structure expected by the Next.js frontend:

    public/data/
      votings/
        sittings.json              ← [{sitting, date}]  used by getSittings()
        {sitting}/
          index.json               ← [{votingNumber, title, topic, date, kind}]  used by getSittingVotings()
          {votingNumber}.json      ← full detail incl. votes[]  used by getVotingDetails()
      votes_by_{type}/
        {person_id}.json           ← [{sitting, votingNumber, date, title, topic, kind, vote}]
    """

    def __init__(self, target_person_type: str = "mp"):
        # "mp" -> votes_by_mp, "senator" -> votes_by_senator
        self.target_dir_name = f"votes_by_{target_person_type}"

    def load(self, transformed_data: tuple[list[dict], dict[str, list]]) -> None:
        try:
            main_sittings, votes_by_person = transformed_data

            # ── 1. Sittings index ─────────────────────────────────────────────
            sittings_index = [
                {"sitting": s["sitting"], "date": s.get("date", "")}
                for s in main_sittings
            ]
            FileLoader.save_json(sittings_index, PUBLIC_DATA_DIR / "votings" / "sittings.json")

            # ── 2. Per-sitting index + per-voting detail files ────────────────
            for sitting in main_sittings:
                sitting_num = sitting["sitting"]
                sitting_dir = PUBLIC_DATA_DIR / "votings" / str(sitting_num)
                sitting_dir.mkdir(parents=True, exist_ok=True)

                # index.json — summary without per-person votes (lighter file for listing)
                SUMMARY_FIELDS = {"votingNumber", "title", "topic", "date", "kind", "sitting"}
                sitting_index = [
                    {k: v for k, v in voting.items() if k in SUMMARY_FIELDS}
                    for voting in sitting.get("votings", [])
                ]
                FileLoader.save_json(sitting_index, sitting_dir / "index.json")

                # {n}.json — full detail including per-person votes
                for voting in sitting.get("votings", []):
                    voting_num = voting.get("votingNumber")
                    if voting_num is None:
                        continue
                    FileLoader.save_json(voting, sitting_dir / f"{voting_num}.json")

            # ── 3. Per-person vote histories ─────────────────────────────────
            details_dir = PUBLIC_DATA_DIR / self.target_dir_name
            details_dir.mkdir(parents=True, exist_ok=True)

            for person_id, votes in votes_by_person.items():
                FileLoader.save_json(votes, details_dir / f"{person_id}.json")

            logger.info(
                f"Saved {len(sittings_index)} sittings, "
                f"{sum(len(s.get('votings', [])) for s in main_sittings)} voting detail files, "
                f"{len(votes_by_person)} member vote histories."
            )

        except Exception as e:
            raise LoadError(f"VotingsLoader failed: {e}") from e
