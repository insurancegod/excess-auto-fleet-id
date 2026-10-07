# Excess Auto Fleet ID

Next.js frontend + Corgi VIN decoder microservice scaffold.

## Structure
- `frontend/` - Next.js 14 app
- `services/vin-decoder/` - Express microservice using @cardog/corgi

## Run
```bash
# Frontend
cd frontend && npm install && npm run dev

# VIN service
cd services/vin-decoder && npm install && npm run dev
```

Service runs on http://localhost:3001/decode
Frontend calls service for VIN decoding.
