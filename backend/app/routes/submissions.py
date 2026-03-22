import json
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Participant, Task, TaskAssignment, Submission, CodeSnapshot, Event
from ..schemas import RunTestsRequest, RunTestsResponse, SubmitRequest, TestResultItem
from ..executor import run_tests

router = APIRouter()


def get_task_and_validate(db: Session, participant_id: str, task_id: str):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    assignment = (
        db.query(TaskAssignment)
        .filter(
            TaskAssignment.participant_id == participant_id,
            TaskAssignment.task_id == task_id,
        )
        .first()
    )
    if not assignment:
        raise HTTPException(status_code=403, detail="Task not assigned to this participant")

    return participant, task, assignment


@router.post("/api/participants/{participant_id}/run-tests", response_model=RunTestsResponse)
def run_tests_endpoint(
    participant_id: str,
    body: RunTestsRequest,
    db: Session = Depends(get_db),
):
    participant, task, assignment = get_task_and_validate(db, participant_id, body.task_id)

    visible_tests = json.loads(task.visible_tests)
    results = run_tests(body.code, visible_tests)

    tests_passed = sum(1 for r in results if r["passed"])
    tests_total = len(results)

    # Log code snapshot
    snapshot = CodeSnapshot(
        id=str(uuid4()),
        participant_id=participant_id,
        task_id=body.task_id,
        code=body.code,
        snapshot_type="test_run",
        timestamp=datetime.utcnow(),
    )
    db.add(snapshot)

    # Log event
    event = Event(
        id=str(uuid4()),
        participant_id=participant_id,
        task_id=body.task_id,
        event_type="run_tests",
        event_metadata=json.dumps({
            "adoption_choice": body.adoption_choice,
            "tests_passed": tests_passed,
            "tests_total": tests_total,
        }),
        timestamp=datetime.utcnow(),
    )
    db.add(event)
    db.commit()

    test_result_items = [
        TestResultItem(
            name=r["name"],
            passed=r["passed"],
            expected=r["expected"],
            actual=r["actual"],
            error=r.get("error"),
        )
        for r in results
    ]

    return RunTestsResponse(
        test_results=test_result_items,
        tests_passed=tests_passed,
        tests_total=tests_total,
    )


@router.post("/api/participants/{participant_id}/submit")
def submit_solution(
    participant_id: str,
    body: SubmitRequest,
    db: Session = Depends(get_db),
):
    participant, task, assignment = get_task_and_validate(db, participant_id, body.task_id)

    visible_tests = json.loads(task.visible_tests)
    results = run_tests(body.code, visible_tests)

    tests_passed = sum(1 for r in results if r["passed"])
    tests_total = len(results)

    # Parse started_at
    try:
        started_at = datetime.fromisoformat(body.started_at)
    except ValueError:
        started_at = datetime.utcnow()

    submission = Submission(
        id=str(uuid4()),
        participant_id=participant_id,
        task_id=body.task_id,
        code=body.code,
        tests_passed=tests_passed,
        tests_total=tests_total,
        test_results=json.dumps(results),
        started_at=started_at,
        submitted_at=datetime.utcnow(),
        timed_out=body.timed_out,
        adoption_choice=body.adoption_choice,
    )
    db.add(submission)

    # Log snapshot
    snapshot = CodeSnapshot(
        id=str(uuid4()),
        participant_id=participant_id,
        task_id=body.task_id,
        code=body.code,
        snapshot_type="submit",
        timestamp=datetime.utcnow(),
    )
    db.add(snapshot)

    db.commit()

    return {
        "submission_id": submission.id,
        "tests_passed": tests_passed,
        "tests_total": tests_total,
        "test_results": results,
        "timed_out": body.timed_out,
    }
