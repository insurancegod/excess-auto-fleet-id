# Excess Auto Fleet ID

Next.js frontend + Corgi VIN decoder microservice scaffold.

## Quickstart

```bash
# 1. Install & start the VIN decoder microservice
cd services/vin-decoder
npm install
npm run dev       # http://localhost:3001

# 2. Install & start the Next.js frontend
cd frontend
npm install
npm run dev       # http://localhost:3000
```

The frontend calls the backend at `http://localhost:3001/decode`.

## Directory Layout

```
excess-auto-fleet-id/
├── frontend/           # Next.js 14 app (app/ router)
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── services/
│   └── vin-decoder/   # Express + @cardog/corgi microservice
│       ├── src/server.ts
│       ├── package.json
│       └── tsconfig.json
├── README.md          # Project overview, setup, API docs
├── DEVELOPMENT.md     # SDLC workflow, contribution guide
├── SCAFFOLD.md      # This file — quick start & layout
└── .gitignore        # (add as needed)
```

## Development Notes

- Corgi decoder initializes once at service startup and caches the VPIC DB
- First decode per session may be slightly slower; subsequent calls use cached schema
- Decode result includes `errors` array — surface validation messages to users
- For production: persist `~/.corgi-cache/` across restarts; consider a cron job to refresh the DB monthly from `https://corgi.cardog.io/vpic.lite.db.gz`
- Add CORS headers if hosting frontend and backend on different domains/ports

## Next Steps

1. Add VIN input form to `frontend/app/page.tsx` or a new page
2. Wire `fetch('/api/decode', { method: 'POST', body: JSON.stringify({ vin }) })`
3. Display decoded components nicely
4. Add error handling for invalid VINs
5. Commit frequently with descriptive messages
