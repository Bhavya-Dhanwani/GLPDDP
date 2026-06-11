# **GLPDDP**

### Golgattam Lakad Pattam De Danadan Pratiyogita

> **⚠️ UNDER CONSTRUCTION** — This README is for developers contributing to the project.

---

## What is GLPDDP?

GLPDDP is a **Cricbuzz-style sports management system**. It allows you to:

- Create, update, delete, and manage **matches**
- Create and manage **series** (tournaments)
- Manage **teams** across different series
- Manage **players** (add, edit, assign to teams/series)
- Handle **squad selection** and **Playing XI**
- **Live scoring** and **ball-by-ball commentary**
- A **Super Admin** who can create multiple admins with granular **permission controls** (who can do what)

---

## Frontend Architecture

We follow a **4-layer architecture** inside the `features/` folder:

```
client/src/features/
├── api/          # All API call functions (fetch, axios, etc.)
├── hooks/        # All custom React hooks
├── ui/           # Only JSX + Module CSS (no logic)
└── state/        # Redux state management (slices, store)
```

### Layer Responsibilities

| Layer | Purpose |
|-------|---------|
| **api/** | Contains functions that make HTTP requests (e.g., `getMatches`, `createSeries`). No React logic here — just raw API calls. |
| **hooks/** | Custom React hooks that combine API calls, state, and UI logic. e.g., `useMatches`, `useAuth`. |
| **ui/** | Contains `jsx/` (React components) and `css/` (CSS Module files). Pure presentational components — no business logic, no API calls, just props in, UI out. |
| **state/** | Redux Toolkit slices, store configuration, and selectors. |

---

### CSS Modules — How To Use

We use **CSS Modules** (`*.module.css`) for scoped styling. This prevents class name collisions across components.

#### ✅ Example

**`client/src/features/ui/jsx/Button.jsx`**
```jsx
import styles from "../css/Button.module.css";

export default function Button({ label, variant = "primary", onClick }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

**`client/src/features/ui/css/Button.module.css`**
```css
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.primary {
  background-color: #007bff;
  color: #fff;
}

.secondary {
  background-color: #6c757d;
  color: #fff;
}

.danger {
  background-color: #dc3545;
  color: #fff;
}
```

#### ✅ Another Example — Composition

**`client/src/features/ui/jsx/MatchCard.jsx`**
```jsx
import styles from "../css/MatchCard.module.css";

export default function MatchCard({ teamA, teamB, scoreA, scoreB, status }) {
  return (
    <div className={styles.card}>
      <div className={styles.teams}>
        <span className={styles.team}>{teamA}</span>
        <span className={styles.vs}>vs</span>
        <span className={styles.team}>{teamB}</span>
      </div>
      <div className={styles.score}>
        <span>{scoreA}</span>
        <span>{scoreB}</span>
      </div>
      <span className={`${styles.status} ${styles[status]}`}>{status}</span>
    </div>
  );
}
```

**`client/src/features/ui/css/MatchCard.module.css`**
```css
.card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.team {
  font-weight: 600;
  font-size: 18px;
}

.vs {
  color: #888;
  font-size: 14px;
}

.score {
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  font-weight: 700;
}

.status {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.live {
  background: #28a745;
  color: #fff;
}

.completed {
  background: #6c757d;
  color: #fff;
}

.upcoming {
  background: #ffc107;
  color: #000;
}
```

> **Rules:**
> - Place `.module.css` files in **`client/src/features/ui/css/`**.
> - Place JSX components in **`client/src/features/ui/jsx/`**.
> - Import CSS as `import styles from "../css/ComponentName.module.css"`.
> - Use `styles.className` to apply styles.
> - Never write inline styles or global CSS classes in components.
> - No logic in UI components — only props and rendering.

---

## Backend Architecture

```
server/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── package.json
├── package-lock.json
├── debug-output.txt
│
├── seed/
│   └── index.js
│
├── src/
│   ├── server.js                  # Application entry point (HTTP server, Socket.IO, Database)
│   ├── app.js                     # Express app configuration, middleware, and route registration
│   │
│   ├── config/
│   │   ├── db.js                  # MongoDB connection setup
│   │   └── container.js           # Dependency injection / service registry
│   │
│   ├── sockets/
│   │   └── socketGateway.js       # Socket.IO initialization and event helpers
│   │
│   ├── shared/
│   │   ├── constants/
│   │   │   ├── roles.js
│   │   │   └── matchStatus.js
│   │   │
│   │   ├── errors/
│   │   │   ├── AppError.js
│   │   │   ├── BadRequestError.js
│   │   │   ├── ConflictError.js
│   │   │   ├── ForbiddenError.js
│   │   │   ├── NotFoundError.js
│   │   │   ├── UnauthorizedError.js
│   │   │   └── index.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js            # Authentication & authorization middleware
│   │   │   ├── errorHandler.js    # Global error handler
│   │   │   ├── notFound.js        # 404 handler
│   │   │   └── validateRequest.js # Request validation middleware
│   │   │
│   │   ├── utils/
│   │   │   └── asyncHandler.js
│   │   │
│   │   └── validators/
│   │       └── common.js          # Shared validation schemas (ObjectId, params, etc.)
│   │
│   ├── modules/
│   │
│   │   ├── auth/                  # Authentication (Register, Login, Logout)
│   │   ├── users/                 # User management (SUPER_ADMIN)
│   │   ├── series/                # Tournament/Series management
│   │   ├── team/                  # Team management
│   │   ├── squad/                 # Squad management
│   │   ├── player/                # Player management
│   │   ├── match/                 # Match lifecycle management
│   │   ├── playing-xi/            # Playing XI selection
│   │   ├── score/                 # Live scoring operations
│   │   └── commentary/            # Ball-by-ball commentary
│   │
│   ├── public-api/
│   │   ├── home/                  # GET /api/home
│   │   ├── match/                 # GET /api/matches
│   │   ├── series/                # GET /api/series
│   │   ├── team/                  # GET /api/teams
│   │   ├── player/                # GET /api/players
│   │   ├── commentary/            # GET /api/matches/:id/commentary
│   │   ├── search/                # GET /api/search
│   │   └── points-table/          # GET /api/series/:id/points-table
│   │
│   ├── cache/
│   │   └── responseCache.js
│   │
│   └── shared/
│       ├── query.js               # Query helpers (pagination, ObjectId validation, search)
│       └── respond.js             # Standard API response helpers
```

### Module Structure

Every module follows the same architecture:

```
module/
├── module.model.js                # Mongoose schema and model
├── module.repository.js           # Database access layer
├── module.service.js              # Business logic layer
├── module.controller.js           # HTTP request handlers
├── module.route.js                # Express routes
│
├── dto/
│   └── module.dto.js              # DTO exports and mappings
│
├── interfaces/
│   └── module.interface.js        # Field definitions and metadata
│
└── validators/
    └── module.validator.js        # Zod validation schemas
```

### What Do These Folders Do?

| File/Folder | Purpose |
|-------------|---------|
| **`module.model.js`** | Defines the Mongoose schema & model for the database collection. |
| **`module.repository.js`** | Database access layer — all DB queries go here (CRUD operations). |
| **`module.service.js`** | Business logic layer — contains all rules, calculations, and orchestration. |
| **`module.controller.js`** | HTTP request handlers — parses request, calls service, sends response. |
| **`module.route.js`** | Defines Express routes and connects them to controller methods. |
| **`dto/`** | **Data Transfer Objects** — transform database models into the shape sent to the client. Hides sensitive fields and formats data. |
| **`interfaces/`** | **Field definitions & metadata** — defines what fields a module has, their types, validation rules, and permissions. Used for dynamic UI generation and permission checks. |
| **`validators/`** | Zod schemas for request validation — ensures incoming data is valid before reaching the controller. |

### Architecture Overview

```
Controller → Service → Repository → Database
```

- **Controller Layer** — handles HTTP requests and responses
- **Service Layer** — business rules and application logic
- **Repository Layer** — all database operations
- **Model Layer** — MongoDB schemas and collections
- **Validators** — request data integrity using Zod
- **DTOs** — standardize data transfer between layers
- **Socket.IO Gateway** — real-time match updates
- **Shared Utilities** — reusable middleware, helpers, constants, error handling

---

## Git Collaboration Guide

```bash
# First time — create your branch
git checkout -b <YourName>

# Switch to your branch
git checkout <YourName>

# Pull latest changes from main
git pull origin main

# --- Code your changes ---

# Stage all changes
git add .

# Commit with a description
git commit -m "Description of the commit"

# Push your branch to remote
git push origin <YourName>

# Repeat: pull → code → add → commit → push
```

### Tips

- Always `git pull origin main` before starting work to avoid merge conflicts.
- Keep commits small and descriptive.
- Never push directly to `main` — always work on your own branch.
- Create a Pull Request (PR) when your feature is ready for review.
