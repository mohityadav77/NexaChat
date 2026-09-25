# NexaChat

NexaChat is a polished AI conversation workspace built to demonstrate strong React and JavaScript fundamentals while introducing a small, understandable Node/Express/MongoDB backend.

## Overview

The product behavior lives mostly in the frontend: component composition, controlled forms, async request states, local persistence, filtering, message actions, markdown/code rendering, theme preferences, keyboard interaction, and responsive layout. The backend is an optional persistence and API boundary.

## Features

- Conversation creation, selection, rename, delete, and search
- Enter to send; Shift + Enter for a new line
- Mock AI service with optional Express API provider
- Loading, retry, error, and offline/mock fallback states
- Markdown-style text, inline code, fenced code blocks, and copy-code action
- Copy, like, dislike, bookmark, and regenerate response actions
- Search within the active conversation with highlighted matches
- Light/dark mode persisted to localStorage
- Local persistence for conversations, preferences, and selected chat
- Mobile drawer navigation and accessible keyboard/focus states
- Optional register/login with bcrypt password hashing and JWT sessions
- MongoDB persistence when configured; in-memory fallback otherwise

## Tech Stack

Frontend: React, JavaScript, HTML, CSS, Vite  
Backend: Node.js, Express.js, MongoDB via Mongoose  
Authentication: bcryptjs and JSON Web Tokens  
Testing: Node’s built-in test runner

No TypeScript, Redux, Next.js, GraphQL, Docker, Redis, WebSockets, or UI framework is used. This keeps the architecture explainable for a React/JavaScript-focused portfolio.

## Architecture

```text
React components → App state + hooks + ThemeContext
                 → aiService / apiClient
                 → mock provider OR Express API
                 → React state + localStorage
                 → responsive UI
```

The optional account path is `AuthModal → Express auth routes → bcrypt/JWT`, while protected conversation routes use MongoDB when available and memory fallback otherwise.

## Folder Structure

- `src/components/` — reusable UI pieces
- `src/context/` — theme context
- `src/data/` — seed conversation data
- `src/hooks/` — localStorage hook
- `src/services/` — AI and HTTP service boundaries
- `server/routes/` — auth, chat, and conversation endpoints
- `server/models.js` — User and Conversation Mongoose schemas
- `server/store.js` — MongoDB/memory persistence adapter
- `tests/` — Node test runner checks

## Setup

Install Node.js 20+, then:

```bash
npm install
```

Copy `.env.example` to `.env` if you want the backend or MongoDB persistence.

## Running Locally

Run the frontend:

```bash
npm run dev
```

Run the backend in a second terminal:

```bash
npm run dev:server
```

The frontend works without the backend. By default it uses the mock assistant service and localStorage. To use the Express chat route, set `VITE_API_URL=http://localhost:4000` and `VITE_ALLOW_MOCK_FALLBACK=true`.

Run a production build and tests with `npm run build` and `npm test`.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Express port, default `4000` |
| `CLIENT_ORIGIN` | Allowed frontend origin for CORS |
| `JWT_SECRET` | Secret used to sign login tokens |
| `MONGODB_URI` | Optional MongoDB connection string |
| `VITE_API_URL` | Optional frontend API base URL |
| `VITE_ALLOW_MOCK_FALLBACK` | Use mock AI if the API is unavailable |

Never put an AI provider key in a `VITE_` variable. Vite exposes those variables to the browser. A real provider key belongs in the server environment and should be used from `server/services/assistantService.js`.

## API Documentation

- `GET /api/health` returns server status and `mongodb` or `memory` persistence.
- `POST /api/chat` accepts a `messages` array and returns an assistant message.
- `POST /api/auth/register` accepts name, email, and password and returns a user plus JWT.
- `POST /api/auth/login` accepts email and password and returns a user plus JWT.
- `GET /api/conversations` requires `Authorization: Bearer <token>`.
- `POST /api/conversations` creates a protected conversation.
- `PATCH /api/conversations/:id` updates conversation fields.
- `DELETE /api/conversations/:id` deletes one conversation.

## Database Structure

`User` stores `name`, normalized `email`, and a `passwordHash`. Plain passwords are never stored.

`Conversation` stores `userId`, title metadata, and embedded `messages`. Each message has an id, role, content, time, and optional feedback flags. Embedding messages keeps this beginner-friendly and matches the product’s loading pattern.

## Technical Decisions

- React state stays in `App` because the sidebar, header, chat window, and composer share conversation state.
- `useLocalStorage` isolates JSON parsing/stringifying and protects the UI from corrupted storage.
- `useMemo` derives filtered conversations; `useRef` powers auto-scroll; `useCallback` stabilizes the update boundary.
- `ThemeContext` avoids threading theme props through every component.
- The service layer keeps provider/API logic out of UI components.
- MongoDB is optional so localStorage and mock AI keep the portfolio demo usable offline.
- The backend introduces REST, middleware, hashing, JWTs, and persistence without moving basic UI responsibilities out of React.

## Deployment

Build the frontend with `npm run build`, deploy `dist/` to a static host, and run `npm start` on a Node host. Set `CLIENT_ORIGIN`, `JWT_SECRET`, and `MONGODB_URI` in the server environment. Set `VITE_API_URL` before building the frontend.

## Edge Cases

The app handles empty messages, repeated sends while loading, provider failures, retry, message search with no results, deleting the active conversation, renaming with an empty value, corrupted localStorage, and backend unavailability. `/error` is a development-only mock command that exercises the error UI.

## Resume Version

**NexaChat — Smart AI Conversation Workspace**  
**Tech:** React, JavaScript, HTML, CSS, Vite, Node.js, Express.js, MongoDB, JWT

- Built a responsive AI conversation workspace in React with reusable components, controlled forms, async loading/error states, message search, markdown/code rendering, and keyboard interactions.
- Implemented local-first persistence for conversations, message feedback, selected chat, preferences, and light/dark themes using custom hooks, JSON serialization, and localStorage.
- Designed an AI service abstraction with mock-provider fallback and optional Express integration, keeping provider logic separate from the UI.
- Added a beginner-friendly Express/Mongoose backend with REST routes, bcrypt password hashing, JWT authentication, MongoDB persistence, and in-memory fallback behavior.

See [INTERVIEW_GUIDE.md](./INTERVIEW_GUIDE.md) and [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for project-specific preparation and verification.
