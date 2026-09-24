# Chat Bot

A small chatbot app: Django REST API backend calling OpenAI, React + TypeScript (Vite) frontend.

## Structure

- `backend/` — Django project (`config`) with a `chatbot` app exposing `POST /api/chat/`.
  - `chatbot/llm_config.py` — model name and generation settings, separate from Django settings.
  - `chatbot/services.py` — OpenAI client call.
- `frontend/` — Vite + React + TypeScript chat UI.

## Backend setup

```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # then fill in OPENAI_API_KEY
python manage.py migrate
python manage.py runserver
```

## Frontend setup

```
cd frontend
npm install
copy .env.example .env   # adjust VITE_API_BASE_URL if needed
npm run dev
```

The frontend expects the backend running at `http://localhost:8000` by default (see `frontend/.env.example`).

## Configuration

- `OPENAI_API_KEY` must be set as an environment variable (in `backend/.env` locally, and as a GitHub secret / Render environment variable in deployment).
- The model used (default `gpt-4o-mini`) and other generation parameters live in `backend/chatbot/llm_config.py`, configurable via environment variables.

CI/CD (GitHub Actions -> Render) is not set up yet; that comes next.
