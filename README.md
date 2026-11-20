# Doomsday Ready

Doomsday Ready is a React and Express application for planning movie
prerequisites and calculating exact opening-night seat bundles.

## Features

- Manage movies and mark them as watched
- Set and update movie prerequisites
- Generate a prerequisite-aware rewatch order
- Detect circular prerequisite dependencies
- Create cinemas and configure available seat bundles
- Calculate exact booking combinations for a requested group size

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Express 5, Node.js
- **Storage:** In-memory application store

## Project Structure

```text
backend/
  src/
    controllers/
    routes/
    services/
    store/
    utils/

frontend/
  src/
    components/
    pages/
    services/
    utils/
```

## Run Locally

### 1. Start the API

```sh
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Start the frontend

Open another terminal:

```sh
cd frontend
npm install
npm run dev
```

Vite prints the local frontend URL when the development server starts.

## API

All application endpoints are prefixed with `/api`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/movies` | List movies |
| `POST` | `/api/movies` | Create a movie |
| `PATCH` | `/api/movies/:id` | Update a movie |
| `GET` | `/api/movies/:id/rewatch-order` | Get the prerequisite order and progress |
| `GET` | `/api/cinemas` | List cinemas |
| `POST` | `/api/cinemas` | Create a cinema |
| `GET` | `/api/cinemas/:id/booking?groupSize=6` | Get an exact booking quote |

Circular dependencies return status `409` with the code
`CIRCULAR_DEPENDENCY`.

## Data Model

### Movie

```text
id
title
year
runtime
watched
prerequisites -> other movie IDs
```

### Cinema

```text
id
name
bundles -> seat counts
```

## Assumptions and Defaults

- Movie release year must be an integer from `1888` through `2100`.
- Movie runtime must be an integer from `1` through `300` minutes.
- Cinema bundle sizes must be unique integers from `1` through `500`.
- Each cinema must have between `1` and `10` bundle sizes.
- Movie and cinema records are stored in memory and reset when the API restarts.
- Editing prerequisites currently uses a browser prompt.
- The seeded cinema's quick examples use bundle sizes `[6, 9, 20]`.

## Validation

Run the backend tests:

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

## Development Process and AI Use

To be completely transparent about how this project was built:

1. **Requirements Breakdown:** I first read through the project requirements myself, then used AI to clarify edge cases and turn the UI requirements into prompts.
2. **UI Design & Frontend:** I used Stitch AI to generate initial UI concepts, then passed screenshots of those designs to a conversational AI (without autonomous or agentic coding) to generate simple React components, which I fine-tuned and integrated into the application.
3. **Backend & Algorithms:** The Express boilerplate, validation logic, and core algorithms (prerequisite cycle detection, rewatch ordering, and the dynamic-programming bundle solver) were written with AI assistance directly in the source code without external solver libraries.
4. **Current Learning & Review:** Because my DSA and backend experience is still at a beginner-to-intermediate level, I am actively studying the codebase line by line to understand how the graph traversal, sorting, and dynamic-programming logic work so I can explain and build on them confidently.
