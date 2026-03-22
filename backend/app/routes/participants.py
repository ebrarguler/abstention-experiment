import json
import random
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Participant, Demographics, Task, TaskAssignment
from ..schemas import ParticipantCreate, ParticipantOut, TaskAssignmentOut, DemographicsCreate

router = APIRouter()


def get_stratum(proficiency: int) -> int:
    if proficiency <= 6:
        return 1
    elif proficiency <= 8:
        return 2
    else:
        return 3


def assign_condition(db: Session, stratum: int) -> str:
    """
    Stratified random assignment: count existing participants per condition
    within the stratum, assign to the condition with fewer (random tie-break).
    """
    always_count = db.query(Participant).filter(
        Participant.proficiency_stratum == stratum,
        Participant.condition == "always_answers"
    ).count()
    abstention_count = db.query(Participant).filter(
        Participant.proficiency_stratum == stratum,
        Participant.condition == "abstention"
    ).count()

    if always_count < abstention_count:
        return "always_answers"
    elif abstention_count < always_count:
        return "abstention"
    else:
        return random.choice(["always_answers", "abstention"])


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


@router.post("/api/participants", response_model=ParticipantOut)
def create_participant(body: ParticipantCreate, db: Session = Depends(get_db)):
    proficiency = body.python_proficiency
    if proficiency < 1 or proficiency > 10:
        raise HTTPException(status_code=400, detail="python_proficiency must be between 1 and 10")

    stratum = get_stratum(proficiency)
    condition = assign_condition(db, stratum)

    participant = Participant(
        id=str(uuid4()),
        condition=condition,
        proficiency_stratum=stratum,
        created_at=datetime.utcnow(),
        status="in_progress",
    )
    db.add(participant)
    db.flush()

    # Load all 6 tasks
    tasks = db.query(Task).all()
    if len(tasks) < 6:
        raise HTTPException(status_code=500, detail="Tasks not seeded properly")

    # Shuffle using Fisher-Yates (random.shuffle is equivalent)
    shuffled_tasks = list(tasks)
    random.shuffle(shuffled_tasks)

    # Create task assignments
    for order, task in enumerate(shuffled_tasks, start=1):
        # Determine ai_response_type based on task_set and condition
        if task.task_set == "C":
            ai_response_type = "correct"
        elif task.task_set == "I":
            ai_response_type = "incorrect"
        elif task.task_set == "A":
            if condition == "always_answers":
                ai_response_type = "correct"
            else:
                ai_response_type = "abstention"
        else:
            ai_response_type = "correct"

        # Determine ai_code_shown
        if ai_response_type == "correct":
            ai_code_shown = task.correct_solution
        elif ai_response_type == "incorrect":
            ai_code_shown = task.incorrect_solution
        else:  # abstention
            ai_code_shown = None

        assignment = TaskAssignment(
            id=str(uuid4()),
            participant_id=participant.id,
            task_id=task.id,
            task_order=order,
            ai_response_type=ai_response_type,
            ai_code_shown=ai_code_shown,
        )
        db.add(assignment)

    db.commit()
    db.refresh(participant)

    # Load assignments ordered by task_order
    assignments = (
        db.query(TaskAssignment)
        .filter(TaskAssignment.participant_id == participant.id)
        .order_by(TaskAssignment.task_order)
        .all()
    )

    task_assignments_out = [build_task_assignment_out(a) for a in assignments]

    return ParticipantOut(
        id=participant.id,
        condition=participant.condition,
        proficiency_stratum=participant.proficiency_stratum,
        status=participant.status,
        task_assignments=task_assignments_out,
    )


@router.post("/api/participants/{participant_id}/demographics")
def save_demographics(
    participant_id: str,
    body: DemographicsCreate,
    db: Session = Depends(get_db),
):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    demo = Demographics(
        id=str(uuid4()),
        participant_id=participant_id,
        age_range=body.age_range,
        gender=body.gender,
        education=body.education,
        years_experience=body.years_experience,
        python_proficiency=body.python_proficiency,
        primary_language=body.primary_language,
        ai_tool_frequency=body.ai_tool_frequency,
        ai_tool_name=body.ai_tool_name,
        current_role=body.current_role,
    )
    db.add(demo)
    db.commit()
    return {"status": "ok", "demographics_id": demo.id}


@router.get("/api/participants/{participant_id}", response_model=ParticipantOut)
def get_participant(participant_id: str, db: Session = Depends(get_db)):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    assignments = (
        db.query(TaskAssignment)
        .filter(TaskAssignment.participant_id == participant_id)
        .order_by(TaskAssignment.task_order)
        .all()
    )

    task_assignments_out = [build_task_assignment_out(a) for a in assignments]

    return ParticipantOut(
        id=participant.id,
        condition=participant.condition,
        proficiency_stratum=participant.proficiency_stratum,
        status=participant.status,
        task_assignments=task_assignments_out,
    )


@router.post("/api/participants/{participant_id}/complete")
def complete_participant(participant_id: str, db: Session = Depends(get_db)):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    participant.status = "completed"
    participant.completed_at = datetime.utcnow()
    db.commit()
    return {"status": "ok"}
