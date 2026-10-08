# Development Guide

## SDLC Process for Excess Auto Fleet ID

This project follows a lightweight SDLC suitable for a full-stack TypeScript project.

### 1. Planning & Requirements
- Define VIN decode use cases (fleet onboarding, bulk import, API endpoint)
- Determine data needed from Corgi vs Cardog API
- Set resource budgets (memory, storage, API rate limits)

### 2. Design
- API contract first: `POST /decode { vin }` → decode result schema
- Database schema for stored fleet vehicles (VIN + normalized fields)
- UI mockups for VIN entry form

### 3. Implementation
- **Backend first**: Implement Express service with Corgi integration
- **Frontend**: Next.js components that consume the API
- **Integration**: Wire form submit → API call → display result

### 4. Testing
- Unit tests for API route validation
- Manual test with known VINs (Honda, Hyundai examples work)
- Edge cases: invalid VIN length, non-alphanumeric, check-digit failures

### 5. Documentation
- README.md (this file) — overview, setup, API, resources
- Inline JSDoc/TypeScript types on API routes
- Deployment guides for target platforms

### 6. Deployment
- Frontend: `npm run build` → static export or Vercel deployment
- Backend: Dockerfile, environment variables for PORT, CORS origins
- Corgi DB cache: persist across restarts, optional monthly refresh script

### 7. Maintenance
- Monitor Corgi DB update schedule (monthly) — script to refresh `vpic.lite.db`
- Log decode failures for analytics (anonymized VINs only)
- Security: validate VIN input length, sanitize before passing to Corgi

### Git Workflow
- Branches: `main` (production), feature branches `feature/...`
- Commits: include `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` trailer
- PR template: describe change, checklist, testing steps

### Known Limitations
- Corgi DB is static between monthly updates; market/recall data needs Cardog API
- Browser decode requires ~20 MB DB download; backend avoids this
- Check-digit validation may flag valid VINs from some regions/schemes
