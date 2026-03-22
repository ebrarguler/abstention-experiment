import json
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Participant, SurveyResponse
from ..schemas import SurveyResponse as SurveyResponseSchema

router = APIRouter()


@router.post("/api/participants/{participant_id}/surveys")
def submit_survey(
    participant_id: str,
    body: SurveyResponseSchema,
    db: Session = Depends(get_db),
):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    survey_response = SurveyResponse(
        id=str(uuid4()),
        participant_id=participant_id,
        task_id=body.task_id,
        survey_type=body.survey_type,
        question_key=body.question_key,
        response_value=body.response_value,
        timestamp=datetime.utcnow(),
    )
    db.add(survey_response)
    db.commit()

    return {"status": "ok", "survey_response_id": survey_response.id}
