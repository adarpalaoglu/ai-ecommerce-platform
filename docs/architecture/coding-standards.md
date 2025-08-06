# Coding Standards

### Critical Fullstack Rules
- **Type Sharing:** Always define types in `packages/shared/src/types` and import from there.
- **API Calls:** Never make direct HTTP calls from components; use the service layer (`apps/web/src/services`).
- **Environment Variables:** Access only through configuration objects (e.g., `config.apiBaseUrl`), never `process.env` directly in application code.
- **Error Handling:** All API routes must use the standard error handler for consistent error responses.
- **State Updates:** Never mutate state directly; use proper state management patterns (e.g., Zustand setters, React `useState` setters).

### Naming Conventions
| Element | Frontend | Backend | Example |
|---|---|---|---|
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/api/user-profile` |
| Database Tables | - | snake_case | `user_profiles` |