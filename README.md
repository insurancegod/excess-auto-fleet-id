# Excess Auto Fleet ID

A fleet vehicle management system with VIN decoding via Corgi microservice.

## Overview

This project provides a Next.js frontend for VIN input and an Express microservice that uses `@cardog/corgi` to decode 17-character VINs using the NHTSA VPIC database offline.

Architecture:
- **Frontend**: Next.js 14 (`frontend/`) — React app for VIN entry and display
- **Backend**: Express microservice (`services/vin-decoder/`) — Corgi decoder API
- **Data**: Corgi decoder bundles NHTSA VPIC lite DB (~40 MB uncompressed, ~20 MB gzipped)

## Architecture

```
┌─────────────────┐      HTTPS       ┌─────────────────────┐
│  Next.js Front  │ ───────────────▶ │  VIN Decoder API    │
│   (app/)        │                  │  (Express + Corgi)  │
│   - page.tsx    │                  │   - POST /decode    │
│   - layout.tsx  │                  │   - GET /health     │
└─────────────────┘                  └─────────────────────┘
         ▲                               │
         │   local dev proxy             │
         └───────────────────────────────┘
```

## Prerequisites

- Node.js >= 18
- npm or pnpm
- ~500 MB disk for repo + Corgi DB cache (~40 MB uncompressed, auto-cached at `~/.corgi-cache/vpic.lite.db`)

## Local Development

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Install VIN decoder service dependencies
cd ../services/vin-decoder
npm install

# 3. Start the VIN decoder service (default port 3001)
cd ../services/vin-decoder
npm run dev   # runs on http://localhost:3001

# 4. Start the Next.js frontend (default port 3000)
cd ../frontend
npm run dev   # runs on http://localhost:3000
```

The frontend will call the backend at `http://localhost:3001/decode`.

## API Endpoints

| Method | Endpoint        | Request Body       | Response                     | Description               |
|--------|-----------------|--------------------|------------------------------|---------------------------|
| POST   | `/decode`       | `{ vin: string }`  | `{ vin, valid, components... }` | Decode a VIN using Corgi  |
| GET    | `/health`       | n/a                | `{ status: "ok" }`           | Health check              |

## Decode Result Shape (excerpt)

```typescript
{
  vin: string;
  valid: boolean;
  components: {
    vehicle: { make, model, year, ... };
    wmi: { manufacturer, country, ... };
    plant: { country, city, code };
    engine: { fuel, cylinders, model, ... };
    modelYear: { year, source, confidence };
    checkDigit: { isValid, expected, actual };
  };
  errors: [{ code, message, ... }];
  patterns?: [{ element, value, ... }];
  metadata: { processingTime, confidence, schemaVersion, ... };
}
```

## Resource Requirements

- **Memory**: ~100 MB at runtime (Corgi loads VPIC DB into memory)
- **Storage**: ~500 MB total (repo + node_modules + Corgi DB cache)
- **CPU**: Decode ~50-100 VINs/sec per instance (varies by VIN complexity)
- **Network**: None required after initial DB download; DB updates monthly from `https://corgi.cardog.io`

## Development Workflow

1. **Feature branch**: `git checkout -b <feature-name>`
2. **Implement**: code in respective directories
3. **Test**: `npm test` in each package, or `curl` the API
4. **Lint**: `npm run lint` in both frontend and service
5. **Commit**: descriptive messages with Co-authored-by trailer
6. **Push**: open PR against `main`

## Deployment

- **Frontend**: Vercel, Netlify, or any Node.js hosting
- **Backend**: Docker container, Fly.io, Render, or any VPS with Node.js
- **DB cache**: Persist `~/.corgi-cache/` across restarts for fastest startup
- **HTTPS**: Required for production; add CORS headers if frontend on different domain

## License

ISC - see LICENSE file.
