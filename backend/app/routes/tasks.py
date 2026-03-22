import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Participant, TaskAssignment
from ..schemas import TaskAssignmentOut

router = APIRouter()


def build_task_assignment_out(assignment: TaskAssignment) -> TaskAssignmentOut:
    task = assignment.task
    visible_tests = json.loads(task.visible_tests)
    return TaskAssignmentOut(
        task_id=task.id,
        task_order=assignment.task_order,
        slug=task.slug,
        title=task.title,
        description=task.description,
        function_signature=task.function_signature,
        starter_code=task.starter_code,
        visible_tests=visible_tests,
        ai_response_type=assignment.ai_response_type,
        ai_code_shown=assignment.ai_code_shown,
    )


@router.get("/api/participants/{participant_id}/tasks")
def get_all_tasks(participant_id: str, db: Session = Depends(get_db)):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    assignments = (
        db.query(TaskAssignment)
        .filter(TaskAssignment.participant_id == participant_id)
        .order_by(TaskAssignment.task_order)
        .all()
    )

    return [build_task_assignment_out(a) for a in assignments]


@router.get("/api/participants/{participant_id}/tasks/{task_order}")
def get_task_by_order(
    participant_id: str,
    task_order: int,
    db: Session = Depends(get_db),
):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    assignment = (
        db.query(TaskAssignment)
        .filter(
            TaskAssignment.participant_id == participant_id,
            TaskAssignment.task_order == task_order,
        )
        .first()
    )

    if not assignment:
        raise HTTPException(status_code=404, detail=f"Task order {task_order} not found")

    return build_task_assignment_out(assignment)
