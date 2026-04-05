import logging
from typing import Any
from transform.base import BaseTransformer
from core.exceptions import TransformError

logger = logging.getLogger("ETL_TRANSFORM_VOTINGS")

class VotingsTransformer(BaseTransformer):
    """Transforms raw voting records from Sejm into generic Voting models and MP aggregations."""
    
    def transform(self, raw_data: Any) -> tuple[list[dict], dict[str, list]]:
        """
        Returns:
        1. List of generic sittings
        2. Dictionary mapping MP ID -> list of their voting records {mp_id: [records]}
        """
        self._validate_list(raw_data)
        
        try:
            sittings = []
            votes_by_person = {} # id -> list of votes
            
            for item in raw_data:
                # Raw data comes as sittings, but the `votings` might be empty depending on extraction level in raw_data
                sitting = {
                    "sitting": item.get('sitting', 0),
                    "title": item.get('title', f"Posiedzenie {item.get('sitting', '?')}"),
                    "dates": item.get('dates', []),
                    "votings": []
                }
                
                # Sittings contain list of votings
                for v in item.get('votings', []):
                    # Base sitting voting summary
                    voting_summary = {
                        "votingNumber": v.get('votingNumber', 0),
                        "title": v.get('title', ''),
                        "topic": v.get('topic', ''),
                        "date": v.get('date', ''),
                        "kind": v.get('kind', ''),
                        "votes": v.get('votes', []) # The count summary or raw?
                    }
                    sitting["votings"].append(voting_summary)
                    
                    # Also build person-centric data
                    meta = {
                        "sitting": item.get('sitting', 0),
                        "votingNumber": v.get('votingNumber', 0),
                        "date": v.get('date', ''),
                        "title": v.get('title', ''),
                        "topic": v.get('topic', ''),
                        "kind": v.get('kind', '')
                    }
                    
                    for person_vote in v.get('votes', []): # Assuming the list of {MP: 1, vote: "YES"} is available here
                        person_id = str(person_vote.get('MP') or person_vote.get('Senator'))
                        if not person_id or person_id == "None":
                            continue
                            
                        if person_id not in votes_by_person:
                            votes_by_person[person_id] = []
                            
                        votes_by_person[person_id].append({
                            **meta,
                            "vote": person_vote.get('vote')
                        })
                
                sittings.append(sitting)
                
            # Sort person votes by date desc
            for pid, p_votes in votes_by_person.items():
                p_votes.sort(key=lambda x: (x['date'], x['votingNumber']), reverse=True)
                
            logger.debug(f"Transformed {len(raw_data)} raw sittings. Aggregated votes for {len(votes_by_person)} people.")
            return sittings, votes_by_person
            
        except Exception as e:
            raise TransformError(f"Error transforming Votings data: {e}") from e
