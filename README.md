# E-commerce Application

This repository contains the code for a full-stack e-commerce application, including a React frontend and a FastAPI backend.

## Running the Development Environment

To ensure a smooth and reliable startup, an automated script is provided to run the entire development environment.

### Instructions

From the root of the project, execute the following command:

```bash
./scripts/run_dev.sh
```

This single command will:

1.  **Stop Conflicting Processes:** Automatically find and stop any processes that might be running on the required ports (`8000` for the backend, `3000` for the frontend) to prevent errors.
2.  **Start Backend API:** Launch the FastAPI backend server.
3.  **Start Frontend App:** Launch the React frontend development server.
4.  **Open Browser:** Open your default web browser to `http://localhost:3000`.

This is the recommended way to run the application for development.

---

### Manual Startup

If you prefer to run the services manually, you can use the following commands from the project root.

**Backend (FastAPI):**
```bash
uvicorn apps.api.src.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (React):**
```bash
npm start --prefix apps/web
```
