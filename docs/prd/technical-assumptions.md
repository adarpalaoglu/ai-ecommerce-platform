# Technical Assumptions

### Repository Structure: Polyrepo
The project will use a polyrepo structure, with two separate repositories: one for the FastAPI backend (`barem-api`) and one for the React/React Native frontend (`barem-client`). This maintains a clear separation of concerns between the frontend and backend codebases.

### Service Architecture: Monolith
The backend will be a single monolithic service built with FastAPI. This approach is simpler to develop, deploy, and manage for the scope of this MVP, providing all necessary API endpoints from a single application.

### Testing Requirements: Unit + Integration
The testing strategy will focus on a combination of unit tests for individual functions and components, along with integration tests to ensure the frontend and backend services communicate correctly. Full end-to-end testing is deferred to post-MVP.

### Additional Technical Assumptions and Requests
*   **Authentication:** JWT-based authentication will be used to secure the API.
*   **Database:** PostgreSQL will be the database of choice.
*   **Caching:** Redis will be used for session management and caching cart data to improve performance.
*   **Frontend State Management:** Redux Toolkit will be used for managing application state on the frontend.