import json
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, SessionLocal, Base
from .models import Task
from .tasks_data import TASKS
from .routes import participants, tasks, submissions, surveys, events


def seed_tasks(db: Session):
    """Seed tasks if they are not already in the database."""
    existing_slugs = {t.slug for t in db.query(Task.slug).all()}

    for task_data in TASKS:
        if task_data["slug"] in existing_slugs:
            continue

        task = Task(
            slug=task_data["slug"],
            title=task_data["title"],
            description=task_data["description"],
            function_signature=task_data["function_signature"],
            starter_code=task_data["starter_code"],
            correct_solution=task_data["correct_solution"],
            incorrect_solution=task_data.get("incorrect_solution"),
            abstention_message=task_data["abstention_message"],
            visible_tests=json.dumps(task_data["visible_tests"]),
            hidden_tests=json.dumps(task_data["hidden_tests"]),
            task_set=task_data["task_set"],
        )
        db.add(task)

    db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed tasks
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_tasks(db)
    finally:
        db.close()
    yield
    # Shutdown (nothing to clean up)


app = FastAPI(title="Abstention Experiment API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participants.router)
app.include_router(tasks.router)
app.include_router(submissions.router)
app.include_router(surveys.router)
app.include_router(events.router)


@app.get("/")
def root():
    return {"status": "ok"}
