from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from uuid import uuid4

from .database import Base


class Participant(Base):
    __tablename__ = "participants"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    condition = Column(String, nullable=False)  # 'always_answers' | 'abstention'
    proficiency_stratum = Column(Integer, nullable=False)  # 1=5-6, 2=7-8, 3=9-10
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, default="in_progress")  # 'in_progress' | 'completed' | 'excluded' | 'withdrawn'

    demographics = relationship("Demographics", back_populates="participant", uselist=False)
    task_assignments = relationship("TaskAssignment", back_populates="participant")
    submissions = relationship("Submission", back_populates="participant")
    code_snapshots = relationship("CodeSnapshot", back_populates="participant")
    events = relationship("Event", back_populates="participant")
    survey_responses = relationship("SurveyResponse", back_populates="participant")


class Demographics(Base):
    __tablename__ = "demographics"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    participant_id = Column(String, ForeignKey("participants.id"), nullable=False)
    age_range = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    education = Column(String, nullable=False)
    years_experience = Column(Integer, nullable=False)
    python_proficiency = Column(Integer, nullable=False)
    primary_language = Column(String, nullable=False)
    ai_tool_frequency = Column(String, nullable=False)
    ai_tool_name = Column(String, nullable=True)
    current_role = Column(String, nullable=False)

    participant = relationship("Participant", back_populates="demographics")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    slug = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    function_signature = Column(String, nullable=False)
    starter_code = Column(String, nullable=False)
    correct_solution = Column(String, nullable=False)
    incorrect_solution = Column(String, nullable=True)
    abstention_message = Column(String, nullable=False)
    visible_tests = Column(String, nullable=False)   # JSON array
    hidden_tests = Column(String, nullable=False)    # JSON array
    task_set = Column(String, nullable=False)        # 'C' | 'I' | 'A'

    task_assignments = relationship("TaskAssignment", back_populates="task")
    submissions = relationship("Submission", back_populates="task")
    code_snapshots = relationship("CodeSnapshot", back_populates="task")


class TaskAssignment(Base):
    __tablename__ = "task_assignments"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    participant_id = Column(String, ForeignKey("participants.id"), nullable=False)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    task_order = Column(Integer, nullable=False)  # 1-6
    ai_response_type = Column(String, nullable=False)  # 'correct' | 'incorrect' | 'abstention'
    ai_code_shown = Column(String, nullable=True)

    participant = relationship("Participant", back_populates="task_assignments")
    task = relationship("Task", back_populates="task_assignments")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    participant_id = Column(String, ForeignKey("participants.id"), nullable=False)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    code = Column(String, nullable=False)
    tests_passed = Column(Integer, nullable=False)
    tests_total = Column(Integer, nullable=False)
    test_results = Column(String, nullable=False)  # JSON
    started_at = Column(DateTime, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    timed_out = Column(Boolean, default=False)
    adoption_choice = Column(String, nullable=False)  # 'used_ai' | 'wrote_scratch'

    participant = relationship("Participant", back_populates="submissions")
    task = relationship("Task", back_populates="submissions")


class CodeSnapshot(Base):
    __tablename__ = "code_snapshots"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    participant_id = Column(String, ForeignKey("participants.id"), nullable=False)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    code = Column(String, nullable=False)
    snapshot_type = Column(String, nullable=False)  # 'test_run' | 'periodic' | 'submit'
    timestamp = Column(DateTime, default=datetime.utcnow)

    participant = relationship("Participant", back_populates="code_snapshots")
    task = relationship("Task", back_populates="code_snapshots")


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    participant_id = Column(String, ForeignKey("participants.id"), nullable=False)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=True)
    event_type = Column(String, nullable=False)
    event_metadata = Column(String, nullable=False)  # JSON
    timestamp = Column(DateTime, default=datetime.utcnow)

    participant = relationship("Participant", back_populates="events")


class SurveyResponse(Base):
    __tablename__ = "survey_responses"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    participant_id = Column(String, ForeignKey("participants.id"), nullable=False)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=True)
    survey_type = Column(String, nullable=False)  # 'post_task_confidence' | 'post_experiment' | 'abstention_notice'
    question_key = Column(String, nullable=False)
    response_value = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    participant = relationship("Participant", back_populates="survey_responses")
