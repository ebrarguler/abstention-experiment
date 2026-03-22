# AI Abstention & Developer Overreliance — Experiment Platform

A research experiment platform investigating whether AI abstention ("I don't know" responses) reduces developer overreliance on AI-generated code.

## Research Overview

**Research Questions:**
- RQ1: Does AI abstention reduce blind acceptance of AI-generated code?
- RQ2: Does AI abstention improve overall task accuracy?
- RQ3: Does AI abstention reduce adoption rates of AI code?

**Design:** Between-subjects, two-condition RCT
- **Group A (Always-Answers):** AI always provides code suggestions
- **Group B (Abstention):** AI sometimes declines to provide code

**Task Sets:**
- Set C (2 tasks): Both groups receive correct AI code
- Set I (2 tasks): Both groups receive subtly incorrect AI code (overreliance measure)
- Set A (2 tasks): Group A receives correct code; Group B receives abstention message

## Quick Start

### With Docker (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Platform Architecture

```
abstention-experiment/
├── backend/                  # FastAPI + SQLite
│   ├── app/
│   │   ├── main.py           # App entry point, startup
│   │   ├── database.py       # SQLAlchemy setup
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── executor.py       # Safe Python code execution
│   │   ├── tasks_data.py     # 6 experiment tasks
│   │   └── routes/           # API route handlers
│   └── requirements.txt
├── frontend/                 # React + TypeScript + Monaco Editor
│   └── src/
│       ├── pages/            # Experiment flow pages
│       ├── components/       # Reusable UI components
│       ├── contexts/         # React context (experiment state)
│       ├── api/              # Backend API client
│       └── types/            # TypeScript type definitions
└── docker-compose.yml
```

## Experiment Flow

1. **Landing Page** — Eligibility screening (Python proficiency ≥ 5, ≥ 1yr experience)
2. **Informed Consent** — Study description, risks/benefits, data handling
3. **Demographics Survey** — Background information
4. **Random Assignment** — Stratified by Python proficiency (strata: 5-6, 7-8, 9-10)
5. **Platform Training** — Interactive tutorial with comprehension check
6. **6 Coding Tasks** — Randomized order, 8 min per task, with:
   - AI suggestion panel (code or abstention)
   - Monaco code editor
   - Test runner (5 visible unit tests)
   - Post-task confidence rating
7. **Post-Experiment Survey** — TAM items + strategy questions
8. **Debrief** — True purpose revealed, correct solutions provided

## Tasks

| Slot | Task | Set | Difficulty |
|------|------|-----|------------|
| 1 | Remove Duplicate Characters | C | Medium |
| 2 | Chunk List | C | Easy |
| 3 | Is Palindrome | I | Medium |
| 4 | Rotate List | I | Medium |
| 5 | Flatten Nested List | A | Medium |
| 6 | Valid Parentheses | A | Medium |

## Dependent Variables

| Variable | Measurement |
|----------|-------------|
| Task accuracy | Automated test suite execution (binary) |
| Overreliance rate | Levenshtein edit distance ≤ 5% on Set I tasks |
| Adoption rate | "Use AI Suggestion" click rate |
| Edit depth | Character-level edit distance |
| Time on task | Timestamp delta (start → submit) |
| Post-task confidence | 7-point Likert |
| Perceived AI reliability | TAM scale (6 items) |

## Analysis Plan

Primary hypotheses tested with:
- **H1 (Overreliance):** Fisher's exact test on blind acceptance rate for Set I tasks
- **H2 (Accuracy):** Chi-square / logistic regression on task accuracy
- **H3 (Adoption):** Chi-square / logistic regression on adoption rate

Data export available via admin dashboard or direct database query.

## Data Export

All data stored in SQLite (`backend/data/experiment.db`). Query directly or via the admin endpoint:

```bash
# Export all submissions
curl http://localhost:8000/api/admin/export > data.json
```

## Ethical Considerations

- IRB approval required before data collection
- Deception by omission (abstention manipulation not disclosed upfront, fully revealed in debrief)
- Participants can withdraw at any time without penalty
- No PII stored alongside experimental data
- Debrief includes correct solutions

## References

- Ruggieri, S., & Pugnana, A. (2025). ML abstention mechanisms.
- Passi, S., & Vorvoreanu, M. (2022). Overreliance on AI literature review.
- Ko, A.J., et al. (2015). A practical guide to controlled experiments of software engineering tools.
- Davis, F.D. (1989). Technology Acceptance Model.
