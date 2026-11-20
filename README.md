# Doomsday Ready

A small React and Express app for planning movie prerequisites and calculating
exact opening-night seat bundles.

## Run locally

Start the API in one terminal:

```sh
cd backend
npm install
npm run dev
```

Start the frontend in another terminal:

```sh
cd frontend
npm install
npm run dev
```

The API runs at `http://localhost:5000`; Vite prints the frontend URL when it
starts. Movie and cinema records are stored in memory and reset when the API
restarts.

## API

All endpoints are prefixed with `/api`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/movies` | List movies |
| `POST` | `/movies` | Create a movie |
| `PATCH` | `/movies/:id` | Update a movie |
| `GET` | `/movies/:id/rewatch-order` | Get prerequisite order and progress |
| `GET` | `/cinemas` | List cinemas |
| `POST` | `/cinemas` | Create a cinema |
| `GET` | `/cinemas/:id/booking?groupSize=6` | Get an exact booking quote |

Circular dependencies return `409` with code `CIRCULAR_DEPENDENCY`.

## Data model

```text
Movie
  id, title, year, runtime, watched
  prerequisites -> other Movie IDs

Cinema
  id, name, bundles -> seat counts
```

## Assumptions

- Movie release year is an integer from 1888 through 2100.
- Movie runtime is an integer from 1 through 300 minutes.
- Cinema bundle sizes are unique integers from 1 through 500; each cinema has
  between 1 and 10 sizes.
- The app uses in-memory storage to keep this assessment implementation small.

## Validation

Run backend tests:

```sh
cd backend
npm test
```

Check the frontend:

```sh
cd frontend
npm run lint
npm run build
```

## AI use

AI assistance was used to review the assessment requirements, identify
implementation gaps, and help make and verify targeted code changes. The
rewatch ordering and minimum-bundle algorithms are implemented in the project
source code without libraries that solve those features.
# Doomsday-Ready
