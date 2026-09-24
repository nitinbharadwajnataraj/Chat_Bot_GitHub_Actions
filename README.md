# Chat Assistant

A small chatbot app: Django REST API backend calling OpenAI, React + TypeScript (Vite) frontend.

## Structure

- `backend/` — Django project (`config`) with a `chatbot` app exposing `POST /api/chat/`.
  - `chatbot/llm_config.py` — model name and generation settings, separate from Django settings.
  - `chatbot/services.py` — OpenAI client call.
  - `chatbot/tests/` — unit tests (serializers, service, view), OpenAI calls mocked out.
- `frontend/` — Vite + React + TypeScript chat UI.
  - `src/App.test.tsx`, `src/api/chat.test.ts` — component and API-client tests (Vitest + Testing Library), `fetch`/API calls mocked out.
- `.github/workflows/` — CI/CD pipelines (see below).

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
npm run dev
```

The frontend expects the backend running at `http://localhost:8000` by default. To point it elsewhere (e.g. a deployed backend URL), set `VITE_API_BASE_URL` in a `frontend/.env` file or in your deployment's build environment.

## Configuration

- `OPENAI_API_KEY` must be set as an environment variable — in `backend/.env` locally, and as a Render environment variable in deployment (the CI pipeline never touches it, since tests mock the OpenAI call).
- The model used (default `gpt-4o-mini`) and other generation parameters live in `backend/chatbot/llm_config.py`, configurable via environment variables.

## Testing and linting

```
# backend
cd backend
ruff check .          # lint
python manage.py test # unit tests

# frontend
cd frontend
npm run lint  # oxlint
npm test      # vitest
```

None of these tests call the real OpenAI API — the OpenAI client and `fetch` calls are mocked, so they run free and deterministically.

## CI/CD

Two independent GitHub Actions workflows, scoped by path so a frontend-only change doesn't re-run backend CI and vice versa:

- `.github/workflows/backend-ci.yml` — on push to `main` touching `backend/**`: lint (`ruff`), Django system check, tests.
- `.github/workflows/frontend-ci.yml` — on push to `main` touching `frontend/**`: lint (`oxlint`), tests (`vitest`), build.

Deployment to Render is triggered by each workflow's `deploy` job (gated with `needs: test`), which calls a Render deploy hook URL stored as a GitHub secret (`RENDER_DEPLOY_HOOK_BACKEND` / `RENDER_DEPLOY_HOOK_FRONTEND`) — so a deploy only fires once lint + tests (+ build, for the frontend) pass. Render's own Auto-Deploy setting is off for both services; only the hook triggers a deploy.
