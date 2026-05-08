# ta-react

Frontend app for Trust Automobile.

## Run Locally

1. Start API (`ta-server`) first:
   - `cd ../ta-server`
   - `npm install`
   - `npm run start:dev`
2. Configure frontend env:
   - Create `ta-react/.env`
   - Add: `VITE_API_URL=http://localhost:3001/api/v1`
   - Optional: `VITE_API_TIMEOUT_MS=15000`
3. Start frontend:
   - `cd ta-react`
   - `npm install`
   - `npm run dev`

## Production Build

- `npm run build`
- `npm run preview`

## API Capability Tracking

- See `docs/API_CAPABILITY_MATRIX.md` for live vs pending endpoint coverage by UI tab.
