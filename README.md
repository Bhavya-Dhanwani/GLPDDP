# GLPDDP

GLPDDP is a cricket match management and live scoring platform. It provides a public cricket experience similar to a lightweight live-score site, plus an admin dashboard for managing series, teams, players, matches, toss, innings, score entry, scorecards, commentary, and match results.

The project is split into two apps:

- `client/` - Next.js frontend
- `server/` - Express, MongoDB, and Socket.IO backend

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, CSS Modules |
| Data fetching | Axios, TanStack React Query |
| State | Redux Toolkit where needed |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Realtime | Socket.IO |
| Auth | JWT access and refresh tokens, cookies |
| Validation | express-validator, Zod for env validation |
| Uploads | ImageKit integration |

## Local Setup

### 1. Prerequisites

Install these before starting:

- Node.js 20 or newer
- npm
- MongoDB local server or MongoDB Atlas URI

### 2. Clone the repo

```bash
git clone <repo-url>
cd glpddp
```

### 3. Install dependencies

There is no root `package.json`, so install dependencies inside both apps.

```bash
cd server
npm install

cd ../client
npm install
```

### 4. Configure backend environment

Create `server/.env`.

```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
API_LIMIT=100
FRONTEND_URL=http://localhost:3000

MONGO_URI=mongodb://127.0.0.1:27017/glpddp

JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret

SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password_or_app_password
SMTP_SERVICE=gmail
SMTP_PORT=587
TRANSACTIONAL_EMAIL=your_email@example.com

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

### 5. Configure frontend environment

Create `client/.env`.

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 6. Start development servers

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:5000/health`

## Useful Commands

### Client

```bash
cd client
npm run dev      # start Next.js development server
npm run build    # production build
npm run start    # run production build
npm run lint     # run ESLint
```

### Server

```bash
cd server
npm run dev      # start API with nodemon
npm start        # start API with node
npm test         # placeholder test command
```

## Application Pages

### Public

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/matches` | Public match list with filters for all, live, upcoming, completed |
| `/matches/[id]` | Match detail page with live score, scorecard, commentary, fall of wickets, stats, graph, fantasy |
| `/series` | Public series list |
| `/series/[id]` | Series detail |
| `/teams` | Public teams list |
| `/players` | Public players list |
| `/players/[id]` | Player profile |
| `/login` | Login |
| `/signup` | Signup |
| `/forgot-password` | Forgot password |
| `/reset-password/[token]` | Reset password |
| `/verify-email` | Email verification |

### Dashboard

| Route | Purpose |
| --- | --- |
| `/dashboard` | Admin overview |
| `/dashboard/series` | Manage series |
| `/dashboard/series/add` | Create or edit series |
| `/dashboard/teams` | Manage teams, if enabled in navigation |
| `/dashboard/players` | Manage players |
| `/dashboard/players/add` | Create or edit players |
| `/dashboard/matches` | Manage matches |
| `/dashboard/matches/add` | Create or edit matches |
| `/dashboard/scoring/[matchId]` | Live scoring console |

## API Overview

All API routes are mounted under `/api`.

### Auth

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Login and issue tokens |
| `POST` | `/api/auth/verify` | Verify account OTP |
| `POST` | `/api/auth/resend-otp` | Resend verification OTP |
| `POST` | `/api/auth/logout` | Logout current session |
| `POST` | `/api/auth/logout-all` | Logout all sessions |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password |
| `POST` | `/api/auth/google` | Google auth token flow |
| `GET` | `/api/auth/google` | Google redirect start |
| `GET` | `/api/auth/google/callback` | Google callback |

### Series

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/series` | Public list of series |
| `GET` | `/api/series/:id` | Public series detail |
| `POST` | `/api/series` | Create series, admin only |
| `PATCH` | `/api/series/:id` | Update series, admin only |
| `DELETE` | `/api/series/:id` | Delete series, admin only |

### Teams

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/teams` | Public list of teams |
| `GET` | `/api/teams/:id` | Public team detail |
| `POST` | `/api/teams` | Create team |
| `PATCH` | `/api/teams/:id` | Update team |
| `DELETE` | `/api/teams/:id` | Delete team |

### Players

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/players` | Public list of players |
| `GET` | `/api/players/:id` | Public player detail |
| `POST` | `/api/players` | Create player |
| `PUT` | `/api/players/:id` | Update player |
| `DELETE` | `/api/players/:id` | Delete player |

### Matches

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/matches` | Public match list with filters |
| `GET` | `/api/matches/:id` | Public match detail |
| `GET` | `/api/matches/series/:seriesId` | Matches for a series |
| `POST` | `/api/matches` | Create match, admin only |
| `PATCH` | `/api/matches/:id` | Update match details and status, admin only |
| `DELETE` | `/api/matches/:id` | Soft delete match, admin only |
| `PATCH` | `/api/matches/:id/publish` | Move draft match to upcoming |
| `PATCH` | `/api/matches/:id/toss` | Save toss winner and decision |
| `PATCH` | `/api/matches/:id/playing-xi` | Save both teams' Playing XI |
| `PATCH` | `/api/matches/:id/start` | Make match live |
| `PATCH` | `/api/matches/:id/innings-break` | Move to innings break |
| `PATCH` | `/api/matches/:id/second-innings` | Start second innings |
| `PATCH` | `/api/matches/:id/abandon` | Mark abandoned |
| `PATCH` | `/api/matches/:id/no-result` | Mark no result |
| `PATCH` | `/api/matches/:id/complete` | Complete match manually |

### Live Scoring

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/live/matches/:matchId` | Public live snapshot |
| `GET` | `/api/live/matches/:matchId/commentary` | Public commentary feed |
| `POST` | `/api/scoring/matches/:matchId/innings` | Start innings, admin only |
| `POST` | `/api/scoring/innings/:inningsId/deliveries` | Record one ball, admin only |
| `PATCH` | `/api/scoring/innings/:inningsId/current-players` | Update striker, non-striker, bowler |

### Uploads

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/uploads/imagekit-auth` | Get ImageKit auth params |

## Realtime Events

Socket.IO is initialized by the backend and clients join match rooms with:

```js
socket.emit("match:join", { matchId });
```

Important emitted events:

| Event | Purpose |
| --- | --- |
| `match:updated` | Match metadata/status changed |
| `innings:started` | New innings created |
| `score:updated` | Ball recorded and live snapshot changed |
| `innings:completed` | Innings finished |
| `match:completed` | Match finished |
| `players:updated` | Current striker/non-striker/bowler changed |
| `commentary:added` | Manual commentary added |

## Database

The project uses MongoDB. Main collections are created from Mongoose models in `server/src/shared/models`.

| Model | Collection Purpose |
| --- | --- |
| `users` | Admin/user accounts, auth profile, verification |
| `sessions` | Refresh/session tracking |
| `tokens` | Verification and reset tokens |
| `Series` | Tournament/series data |
| `teams` | Teams, logos, colors, squad players |
| `players` | Player profile and career/stat data |
| `Match` | Fixture, status, teams, toss, Playing XI, result |
| `Innings` | Innings totals, current players, batting and bowling scorecards |
| `Delivery` | Ball-by-ball delivery data |
| `Commentary` | Ball and manual commentary |

### Match Status Flow

Common lifecycle:

```text
DRAFT -> UPCOMING -> TOSS_COMPLETED -> PLAYING_XI_SELECTED -> LIVE
LIVE -> INNINGS_BREAK -> LIVE -> COMPLETED
```

Other terminal statuses:

```text
ABANDONED
NO_RESULT
```

### Scoring Data Flow

1. Create teams and players.
2. Add squad players to both teams.
3. Create a match.
4. Publish the match or set status to `UPCOMING`.
5. Save toss data.
6. Select Playing XI or let the scorer use the first 11 squad players.
7. Make match live.
8. Start innings.
9. Record deliveries.
10. Innings and match completion are calculated from wickets, overs, and target.

## Folder Structure

```text
glpddp/
+-- README.md
+-- client/
|   +-- package.json
|   +-- next.config.mjs
|   +-- src/
|       +-- app/                         # Next.js app routes
|       +-- features/
|       |   +-- auth/                    # Login, signup, verification UI/API
|       |   +-- cricket/                 # Public cricket pages, live match UI
|       |   +-- dashboard/               # Admin dashboard and scoring console
|       |   +-- landing/                 # Landing page sections
|       +-- lib/                         # Axios and Socket.IO clients
|       +-- store/                       # Redux store
+-- server/
    +-- package.json
    +-- server.js                        # API entry point
    +-- src/
        +-- app.js                       # Express app setup
        +-- modules/
        |   +-- private/                 # Admin-only modules
        |   |   +-- match/
        |   |   +-- player/
        |   |   +-- scoring/
        |   |   +-- series/
        |   |   +-- teams/
        |   |   +-- upload/
        |   |   +-- user/
        |   +-- public/                  # Public API modules
        |       +-- auth/
        |       +-- match/
        |       +-- player/
        |       +-- scoring/
        |       +-- series/
        |       +-- teams/
        |       +-- token/
        +-- shared/
        |   +-- config/                  # Env, DB, logger
        |   +-- constants/               # Statuses, roles, scoring constants
        |   +-- errors/                  # Custom errors
        |   +-- middlewares/             # Auth, security, validation, errors
        |   +-- models/                  # Mongoose models
        |   +-- repositories/            # DB access layer
        |   +-- routers/                 # Main route mounting
        |   +-- utils/                   # API response and async helpers
        +-- socket/                      # Socket.IO server setup
```

## Backend Architecture

Most backend modules follow this pattern:

```text
route -> validator -> controller -> service -> repository -> model
```

| Layer | Responsibility |
| --- | --- |
| Route | Defines HTTP method/path and middleware |
| Validator | Validates params/body/query |
| Controller | Reads request and sends response |
| Service | Business logic and rules |
| Repository | Database queries |
| Model | Mongoose schema |

## Frontend Architecture

Feature folders usually follow:

```text
feature/
+-- api/        # Axios API functions
+-- hooks/      # React Query and feature hooks
+-- state/      # Redux slices when needed
+-- ui/
    +-- jsx/    # React components
    +-- css/    # CSS modules
```

Rules:

- Keep API calls in `api/`.
- Keep React Query logic in `hooks/`.
- Keep presentational components in `ui/jsx`.
- Keep feature styles in `ui/css/*.module.css`.
- Use existing components and CSS patterns before adding new abstractions.

## Authentication Notes

Private routes require authentication and role authorization. Admin-only APIs are protected by:

- `authMiddleware`
- `authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN)`

Auth uses access and refresh tokens. The frontend Axios client handles API requests through `client/src/lib/axios.js`.

## Common Development Workflow

```bash
# Start backend
cd server
npm run dev

# Start frontend in another terminal
cd client
npm run dev

# Build frontend before pushing
cd client
npm run build
```

## Troubleshooting

### Backend fails on env validation

Check `server/.env`. Required values include JWT secrets, SMTP config, Google OAuth config, and `MONGO_URI`.

### Frontend cannot call API

Check `client/.env`.

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Live score does not update

Confirm:

- Backend server is running.
- `NEXT_PUBLIC_SOCKET_URL` points to the backend server.
- Match is joined through the live match hook.
- Match status is `LIVE`.

### Scorer dropdowns are empty

Confirm:

- Both teams have squad players.
- Each team has at least 11 players for auto Playing XI fallback.
- Match has toss data and is live before starting innings.

## Git Workflow

```bash
git checkout -b your-branch
git pull origin main
git add .
git commit -m "Describe your change"
git push origin your-branch
```

Open a pull request after pushing your branch.
