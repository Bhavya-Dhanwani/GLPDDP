# GLPDDP

GLPDDP is a cricket platform for two kinds of users:

- fans who want live scores, match details, team pages, player pages, commentary, and score trends
- admins/scorers who need to create the cricket data, manage matches, and score live innings ball by ball

It is split into two apps:

- `client/` - Next.js frontend
- `server/` - Express + MongoDB + Socket.IO backend

## What You Get

- public cricket home page with live-focused landing sections
- public pages for matches, series, teams, and players
- match detail pages with scorecards, commentary, graph, and live chat
- admin dashboard for series, teams, players, matches, and users
- live scoring console with toss, innings start, player updates, wickets, extras, and commentary
- real-time updates over Socket.IO
- a backend seed script to quickly load 4 international teams and 60 players

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 16, React 19, CSS Modules |
| Client state/data | React Query, Redux Toolkit, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Realtime | Socket.IO |
| Charts | Recharts |
| Validation | express-validator, Zod |
| Auth | JWT access/refresh flow |
| Uploads | ImageKit |

## Project Shape

```text
glpddp/
+-- README.md
+-- client/
|   +-- package.json
|   +-- src/
|       +-- app/                 # Next.js routes
|       +-- components/          # shared layout pieces
|       +-- features/
|           +-- auth/            # auth UI + hooks
|           +-- cricket/         # public cricket pages
|           +-- dashboard/       # admin dashboard + scoring
|           +-- landing/         # homepage sections
+-- server/
    +-- package.json
    +-- seed.js                  # database seed script
    +-- server.js                # backend entrypoint
    +-- src/
        +-- app.js
        +-- modules/
        |   +-- private/         # protected/admin APIs
        |   +-- public/          # public APIs
        +-- shared/
        |   +-- config/
        |   +-- constants/
        |   +-- middlewares/
        |   +-- models/
        |   +-- repositories/
        |   +-- routers/
        |   +-- utils/
        +-- socket/
```

## Local Setup

### 1. Prerequisites

- Node.js 20+
- npm
- MongoDB local instance or Atlas URI

### 2. Clone

```bash
git clone <repo-url>
cd glpddp
```

### 3. Install dependencies

There is no root `package.json`, so install inside both apps.

```bash
cd server
npm install

cd ../client
npm install
```

## Environment

### Backend: `server/.env`

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

### Frontend: `client/.env`

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Run It

### Start backend

```bash
cd server
npm run dev
```

### Start frontend

```bash
cd client
npm run dev
```

### Open

- frontend: `http://localhost:3000`
- backend health check: `http://localhost:5000/health`

## Seed the Database

The backend now includes a seed script:

```bash
cd server
npm run seed
```

What it seeds:

- `4` international teams
- `15` players per team
- `60` players total

Seed notes:

- player `image` is stored as `""`
- team `logo` is stored as `""`
- rerunning the seed updates existing seeded records instead of duplicating them

Current seeded teams:

- India
- Australia
- England
- New Zealand

## Useful Commands

### Client

```bash
cd client
npm run dev
npm run build
npm run start
npm run lint
```

### Server

```bash
cd server
npm run dev
npm start
npm run seed
npm test
```

## App Routes

### Public Routes

| Route | What it does |
| --- | --- |
| `/` | Landing page |
| `/matches` | Match list |
| `/matches/[id]` | Match detail with score, commentary, graph, fantasy tab, and live chat |
| `/series` | Series list |
| `/series/[id]` | Series detail |
| `/teams` | Team list |
| `/teams/[id]` | Team detail |
| `/players` | Player list |
| `/players/[id]` | Player detail |
| `/login` | Login |
| `/signup` | Signup |
| `/forgot-password` | Forgot password |
| `/reset-password/[token]` | Reset password |
| `/verify-email` | Verify email |

### Dashboard Routes

| Route | What it does |
| --- | --- |
| `/dashboard` | Dashboard overview |
| `/dashboard/series` | Manage series |
| `/dashboard/series/add` | Add/edit series |
| `/dashboard/teams` | Manage teams |
| `/dashboard/teams/add` | Add/edit team |
| `/dashboard/players` | Manage players |
| `/dashboard/players/add` | Add/edit player |
| `/dashboard/matches` | Manage matches |
| `/dashboard/matches/add` | Add/edit match |
| `/dashboard/scoring/[matchId]` | Live scoring console |
| `/dashboard/users` | User management for `SUPER_ADMIN` |

## Recently Added Product Bits

- team detail page at `/teams/[id]`
- clickable team cards from the teams listing
- live global match chat on `/matches/[id]` for logged-in users
- live run progression graph for both teams using `recharts`
- mobile dashboard sidebar drawer behavior
- filters/search across dashboard listing pages
- searchable selection in team creation
- searchable team selection in match creation
- playing XI role cycle in match creation:
  - player
  - wicketkeeper
  - captain
  - both
  - unselect

## Realtime

Clients join a match room like this:

```js
socket.emit("match:join", { matchId });
```

Useful events:

| Event | Purpose |
| --- | --- |
| `match:updated` | Match metadata or status changed |
| `innings:started` | A new innings started |
| `score:updated` | Score changed after a delivery |
| `innings:completed` | Innings finished |
| `match:completed` | Match finished |
| `players:updated` | Striker, non-striker, or bowler changed |
| `commentary:added` | Commentary feed updated |
| `chat:message` | Match chat message broadcast |

Chat note:

- chat messages are broadcast in the match room
- they are not stored in MongoDB
- only authenticated users can send them

## API Snapshot

All backend routes are mounted under `/api`.

### Auth

| Method | Route |
| --- | --- |
| `POST` | `/api/auth/signup` |
| `POST` | `/api/auth/login` |
| `POST` | `/api/auth/verify` |
| `POST` | `/api/auth/resend-otp` |
| `POST` | `/api/auth/logout` |
| `POST` | `/api/auth/logout-all` |
| `POST` | `/api/auth/refresh` |
| `GET` | `/api/auth/me` |
| `POST` | `/api/auth/forgot-password` |
| `POST` | `/api/auth/reset-password` |
| `POST` | `/api/auth/google` |
| `GET` | `/api/auth/google` |
| `GET` | `/api/auth/google/callback` |

### Series

| Method | Route |
| --- | --- |
| `GET` | `/api/series` |
| `GET` | `/api/series/:id` |
| `POST` | `/api/series` |
| `PATCH` | `/api/series/:id` |
| `DELETE` | `/api/series/:id` |

### Teams

| Method | Route |
| --- | --- |
| `GET` | `/api/teams` |
| `GET` | `/api/teams/:id` |
| `POST` | `/api/teams` |
| `PATCH` | `/api/teams/:id` |
| `DELETE` | `/api/teams/:id` |

### Players

| Method | Route |
| --- | --- |
| `GET` | `/api/players` |
| `GET` | `/api/players/:id` |
| `POST` | `/api/players` |
| `PUT` | `/api/players/:id` |
| `DELETE` | `/api/players/:id` |

### Matches

| Method | Route |
| --- | --- |
| `GET` | `/api/matches` |
| `GET` | `/api/matches/:id` |
| `GET` | `/api/matches/series/:seriesId` |
| `POST` | `/api/matches` |
| `PATCH` | `/api/matches/:id` |
| `DELETE` | `/api/matches/:id` |
| `PATCH` | `/api/matches/:id/publish` |
| `PATCH` | `/api/matches/:id/toss` |
| `PATCH` | `/api/matches/:id/playing-xi` |
| `PATCH` | `/api/matches/:id/start` |
| `PATCH` | `/api/matches/:id/innings-break` |
| `PATCH` | `/api/matches/:id/second-innings` |
| `PATCH` | `/api/matches/:id/abandon` |
| `PATCH` | `/api/matches/:id/no-result` |
| `PATCH` | `/api/matches/:id/complete` |

### Live Scoring

| Method | Route |
| --- | --- |
| `GET` | `/api/live/matches/:matchId` |
| `GET` | `/api/live/matches/:matchId/commentary` |
| `POST` | `/api/scoring/matches/:matchId/innings` |
| `POST` | `/api/scoring/innings/:inningsId/deliveries` |
| `PATCH` | `/api/scoring/innings/:inningsId/current-players` |

### Uploads

| Method | Route |
| --- | --- |
| `GET` | `/api/uploads/imagekit-auth` |

## Match Lifecycle

Common happy-path flow:

```text
DRAFT -> UPCOMING -> TOSS_COMPLETED -> PLAYING_XI_SELECTED -> LIVE
LIVE -> INNINGS_BREAK -> LIVE -> COMPLETED
```

Other terminal states:

```text
ABANDONED
NO_RESULT
```

## Scoring Flow

1. Create players and teams, or run the seed.
2. Make sure both teams have at least 11 squad players.
3. Create a match.
4. Publish the match.
5. Save toss details.
6. Select playing XI.
7. Start the match.
8. Start the innings.
9. Score deliveries live.
10. Let innings and result state progress.

## Data Model Snapshot

Main collections come from Mongoose models in `server/src/shared/models`.

| Model | Purpose |
| --- | --- |
| `users` | Accounts, roles, auth profile |
| `sessions` | Refresh/session tracking |
| `tokens` | Verification and reset tokens |
| `teams` | Team profile, colors, squad |
| `players` | Player profile and stats |
| `Match` | Match metadata, status, toss, XI, result |
| `Innings` | Innings snapshot and scorecards |
| `Delivery` | Ball-by-ball scoring |
| `Commentary` | Commentary feed |

## Backend Pattern

Most backend features follow:

```text
route -> validator -> controller -> service -> repository -> model
```

That keeps request validation, business logic, and database access from getting tangled into one giant file of regret.

## Final Note

This repo is already more than a demo site. It has a public cricket experience, a working admin/scoring surface, realtime match updates, and enough seeded data support to get a local environment moving fast.

If you are hopping in fresh, the fastest path is:

```bash
cd server && npm install && npm run seed && npm run dev
cd client && npm install && npm run dev
```
