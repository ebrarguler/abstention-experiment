from pydantic import BaseModel
from typing import Optional, List, Any


class ParticipantCreate(BaseModel):
    python_proficiency: int


class TaskAssignmentOut(BaseModel):
    task_id: str
    task_order: int
    slug: str
    title: str
    description: str
    function_signature: str
    starter_code: str
    visible_tests: List[Any]
    ai_response_type: str
    ai_code_shown: Optional[str] = None


class ParticipantOut(BaseModel):
    id: str
    condition: str
    proficiency_stratum: int
    status: str
    task_assignments: List[TaskAssignmentOut]


class DemographicsCreate(BaseModel):
    age_range: str
    gender: str
    education: str
    years_experience: int
    python_proficiency: int
    primary_language: str
    ai_tool_frequency: str
    ai_tool_name: Optional[str] = None
    current_role: str


class TestResultItem(BaseModel):
    name: str
    passed: bool
    expected: str
    actual: str
    error: Optional[str] = None


class RunTestsRequest(BaseModel):
    code: str
    task_id: str
    adoption_choice: str
    participant_id: str


class RunTestsResponse(BaseModel):
    test_results: List[TestResultItem]
    tests_passed: int
    tests_total: int


class SubmitRequest(BaseModel):
    code: str
    task_id: str
    adoption_choice: str
    started_at: str  # ISO datetime string
    timed_out: bool


class SurveyResponse(BaseModel):
    task_id: Optional[str] = None
    survey_type: str
    question_key: str
    response_value: str


class EventCreate(BaseModel):
    task_id: Optional[str] = None
    event_type: str
    metadata: dict


class SnapshotCreate(BaseModel):
    task_id: str
    code: str
    snapshot_type: str
