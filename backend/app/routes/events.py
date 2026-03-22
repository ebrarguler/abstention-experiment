import json
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Participant, Event
from ..schemas import EventCreate

router = APIRouter()


@router.post("/api/participants/{participant_id}/events")
def log_event(
    participant_id: str,
    body: EventCreate,
    db: Session = Depends(get_db),
):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    event = Event(
        id=str(uuid4()),
        participant_id=participant_id,
        task_id=body.task_id,
        event_type=body.event_type,
        event_metadata=json.dumps(body.metadata),
        timestamp=datetime.utcnow(),
    )
    db.add(event)
    db.commit()

    return {"status": "ok", "event_id": event.id}
