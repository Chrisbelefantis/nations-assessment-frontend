# Nations Frontend

An Angular 20 application for browsing countries and their languages. It uses Angular Material for UI and integrates with a backend service running on `http://localhost:8080`.

## Features

- Countries list with server‑side pagination
- Country details view showing languages with pagination
- Angular Material table, paginator, and toolbar
- Client‑side routing between Home, Countries, and Country Detail pages

## Tech Stack

- Angular 20 (standalone components)
- Angular Material & CDK
- RxJS, HttpClient

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Backend API available at `http://localhost:8080`

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server
   ```bash
   npm start
   # or
   ng serve
   ```
3. Open the app at `http://localhost:4200`

The dev server reloads automatically on file changes.

## Backend API

This frontend expects a backend providing the following endpoints (with pagination via query params `pageNumber` and `pageSize`):

- GET `http://localhost:8080/country/all`
  - Response shape (example):
    ```json
    {
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 100,
      "countries": [
        { "id": 1, "name": "Greece", "area": "131,957 km²", "countryCode": "GR" }
      ]
    }
    ```
- GET `http://localhost:8080/country/{id}/languages`
  - Response shape (example):
    ```json
    {
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 4,
      "languages": [
        { "language": "Greek", "official": true }
      ]
    }
    ```

If your backend uses a different base URL or shapes, see Configuration below.

## Scripts

- `npm start` – run dev server at `http://localhost:4200`
- `npm run build` – production build to `dist/`
- `npm test` – unit tests via Karma/Jasmine

## Configuration

- API base URLs are currently hardcoded in:
  - `src/app/pages/countries/countries.ts`
  - `src/app/pages/country-detail/country-detail.ts`

  Update the `http://localhost:8080/...` URLs there to point to your backend if needed.

- CORS: When serving the frontend from `4200` and the API from `8080`, ensure your backend allows CORS or configure an Angular dev-server proxy. A proxy setup can avoid CORS issues by forwarding `/api` routes to the backend.

## Project Structure (high level)

- `src/app/app.ts` – root component with Material toolbar and router outlet
- `src/app/app.routes.ts` – routes for Home, Countries, Country Detail
- `src/app/pages/home/*` – landing page
- `src/app/pages/countries/*` – countries table with paginator
- `src/app/pages/country-detail/*` – languages table with paginator
- `src/main.ts` – bootstraps app, provides router and HttpClient

## Build

```bash
npm run build
```

Artifacts are emitted under `dist/` with production optimizations.

## Testing

```bash
npm test
```

Runs unit tests with Karma/Jasmine.

## Notes

- Angular Material theme is imported globally in `src/styles.css`.
- The app uses standalone components (no NgModule) and provides `HttpClient` via `provideHttpClient()` in `src/main.ts`.
