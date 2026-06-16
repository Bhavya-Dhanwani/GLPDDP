# 🔌 Socket.IO Server — GLPDDP

## Overview

The socket server is built using **Socket.IO v4** on top of a Node.js `http.Server`. It enables **real-time, room-based broadcasting** of match lifecycle and scoring events to all connected clients watching a specific match.

- **File**: `src/socket/socket.server.js`
- **Initialized in**: `server.js` via `initializeSocket(httpServer)`
- **CORS Origin**: Controlled by `env.FRONTEND_URL`

---

## 🏠 Room Architecture

Every match gets its own **Socket.IO room** using the naming convention:

```
match:{matchId}
```

A client must explicitly **join** a room to receive events for that match. All server-side emits are scoped to a specific room — there are no global broadcasts.

---

## 📥 Events the Server LISTENS For (Client → Server)

| Event Name     | Payload                     | Acknowledgement         | Description                                                       |
|----------------|-----------------------------|-------------------------|-------------------------------------------------------------------|
| `connection`   | *(auto)*                    | —                       | Fired automatically when a client connects via Socket.IO          |
| `match:join`   | `{ matchId: string }`       | `{ success, room? }`    | Client joins room `match:{matchId}` to receive live updates       |
| `match:leave`  | `matchId: string`           | `{ success }`           | Client leaves room `match:{matchId}` and stops receiving updates  |
| `disconnect`   | *(auto)*                    | —                       | Fired automatically when a client disconnects                     |

### Acknowledgements on `match:join`
Both `match:join` and `match:leave` now support an optional callback for confirmation:

```js
// Client-side usage
socket.emit("match:join", { matchId: "abc123" }, (ack) => {
  if (ack.success) {
    console.log("Joined room:", ack.room); // "match:abc123"
  } else {
    console.error("Join failed:", ack.error);
  }
});
```

---

## 📤 Events the Server EMITS (Server → Client)

All events are emitted **only to clients inside the room** `match:{matchId}`.

---

### 1. `match:updated`
**Triggered by**: Any mutation to the match document via the admin/private API.

| Trigger API Endpoint                    | What happened                                     |
|-----------------------------------------|---------------------------------------------------|
| `PATCH /api/matches/:id`                | General match details updated                     |
| `PATCH /api/matches/:id/publish`        | Match status: `DRAFT` → `UPCOMING`               |
| `PATCH /api/matches/:id/toss`           | Toss recorded → `TOSS_COMPLETED`                 |
| `PATCH /api/matches/:id/playing-xi`     | Playing XI selected → `PLAYING_XI_SELECTED`      |
| `PATCH /api/matches/:id/start`          | Match started → `LIVE`                           |
| `PATCH /api/matches/:id/innings-break`  | Innings break → `INNINGS_BREAK`                  |
| `PATCH /api/matches/:id/second-innings` | Second innings started → `LIVE`                  |
| `PATCH /api/matches/:id/abandon`        | Match abandoned → `ABANDONED`                    |
| `PATCH /api/matches/:id/no-result`      | Match marked → `NO_RESULT`                       |
| `PATCH /api/matches/:id/complete`       | Match completed → `COMPLETED` *(also fires `match:completed`)* |

**Payload**: Sanitized match document.

```json
{
  "_id": "...",
  "status": "LIVE",
  "team1": "...",
  "team2": "...",
  "tossWinner": "...",
  "tossDecision": "BAT",
  "winner": null,
  "result": null
}
```

---

### 2. `match:completed` ✅ *(new)*
**Triggered by**: `PATCH /api/matches/:id/complete` only.

A dedicated event fired **in addition to** `match:updated` when the match is officially completed. The client can listen to this event specifically to show a "Match Over" UI state, final scorecard, winner banner, etc., without inspecting the `status` field of `match:updated`.

**Payload**: Same sanitized match document as `match:updated` (with `status: "COMPLETED"`, `winner`, `result`, `manOfTheMatch` populated).

```json
{
  "_id": "...",
  "status": "COMPLETED",
  "winner": "...",
  "result": "India won by 5 wickets",
  "manOfTheMatch": "..."
}
```

---

### 3. `innings:started`
**Triggered by**: `POST /api/scoring/matches/:matchId/innings`

Emitted when a new innings officially begins (opening batters and bowler set).

**Payload**: Full snapshot object.

```json
{
  "match": { ... },
  "innings": [ ... ],
  "deliveries": [ ... ],
  "commentary": [ ... ]
}
```

---

### 4. `score:updated`
**Triggered by**: `POST /api/scoring/innings/:inningsId/deliveries` (a ball is bowled)

Emitted on every legal or illegal delivery. Payload is always the same consistent shape.

**Payload**:
```json
{
  "delivery": { ... },      // The recorded delivery document
  "commentary": { ... },    // Auto-generated commentary for this delivery
  "snapshot": {
    "match": { ... },
    "innings": [ ... ],
    "deliveries": [ ... ],  // Last 12 deliveries
    "commentary": [ ... ]   // Last 30 commentary entries
  }
}
```

> **Note**: For full over-by-over history, use the REST endpoint `GET /api/live/matches/:matchId/commentary` (paginated). The snapshot is intended for live ticker use only.

---

### 5. `innings:completed` ✅ *(new)*
**Triggered by**: `POST /api/scoring/innings/:inningsId/deliveries` — fired **after** `score:updated` on the final delivery of an innings (10 wickets / overs exhausted / target reached).

A dedicated event so the client can cleanly transition to an "Innings Over" UI state without inspecting the `status` field inside the snapshot.

**Payload**:
```json
{
  "inningsNumber": 1,
  "snapshot": {
    "match": { ... },
    "innings": [ ... ],
    "deliveries": [ ... ],
    "commentary": [ ... ]
  }
}
```

---

### 6. `players:updated` ✅ *(new — replaces `score:updated` for player changes)*
**Triggered by**: `PATCH /api/scoring/innings/:inningsId/current-players`

Previously this fired `score:updated` with only a `snapshot` (no `delivery` or `commentary`), making the payload shape inconsistent. It now fires a dedicated `players:updated` event so the client can differentiate and handle it independently.

**Payload**:
```json
{
  "snapshot": {
    "match": { ... },
    "innings": [ ... ],
    "deliveries": [ ... ],
    "commentary": [ ... ]
  }
}
```

---

## 📊 Full Event Flow Diagram

```
Client connects
    └── socket.emit("match:join", { matchId }, callback)
            ├── Server: socket.join("match:{matchId}")
            └── callback({ success: true, room: "match:{matchId}" })

Admin triggers REST API
    ├── PATCH /api/matches/:id/start
    │       └── emits  "match:updated"       → room match:{matchId}
    │
    ├── PATCH /api/matches/:id/complete
    │       ├── emits  "match:updated"        → room match:{matchId}
    │       └── emits  "match:completed"      → room match:{matchId}
    │
    ├── POST  /api/scoring/matches/:id/innings
    │       └── emits  "innings:started"      → room match:{matchId}
    │
    ├── POST  /api/scoring/innings/:id/deliveries   (normal ball)
    │       └── emits  "score:updated"        → room match:{matchId}
    │
    ├── POST  /api/scoring/innings/:id/deliveries   (final ball of innings)
    │       ├── emits  "score:updated"        → room match:{matchId}
    │       └── emits  "innings:completed"    → room match:{matchId}
    │
    └── PATCH /api/scoring/innings/:id/current-players
            └── emits  "players:updated"      → room match:{matchId}

Client disconnects
    └── Automatically removed from all rooms
```

---

## 🧪 Manual Testing Guide (Postman / Browser Console)

```js
// Connect
const socket = io("http://localhost:<PORT>", { withCredentials: true });

// Join match room with acknowledgement
socket.emit("match:join", { matchId: "<matchId>" }, (ack) => {
  console.log("Join ack:", ack); // { success: true, room: "match:<matchId>" }
});

// Listen for all events
socket.on("match:updated",    (data) => console.log("match:updated", data));
socket.on("match:completed",  (data) => console.log("match:completed", data));
socket.on("innings:started",  (data) => console.log("innings:started", data));
socket.on("score:updated",    (data) => console.log("score:updated", data));
socket.on("innings:completed",(data) => console.log("innings:completed", data));
socket.on("players:updated",  (data) => console.log("players:updated", data));

// Leave room
socket.emit("match:leave", "<matchId>", (ack) => {
  console.log("Leave ack:", ack); // { success: true }
});
```

---

## 📋 Events Reference Summary

| Event              | Direction         | Payload                                  | When fired                                     |
|--------------------|-------------------|------------------------------------------|------------------------------------------------|
| `match:join`       | Client → Server   | `{ matchId }`                            | Client wants live updates for a match          |
| `match:leave`      | Client → Server   | `matchId`                                | Client stops watching a match                  |
| `match:updated`    | Server → Client   | Sanitized match object                   | Any match state change                         |
| `match:completed`  | Server → Client   | Sanitized match object                   | Match is officially completed                  |
| `innings:started`  | Server → Client   | Full snapshot                            | New innings begins                             |
| `score:updated`    | Server → Client   | `{ delivery, commentary, snapshot }`     | A ball is recorded                             |
| `innings:completed`| Server → Client   | `{ inningsNumber, snapshot }`            | Innings ends (wickets / overs / target)        |
| `players:updated`  | Server → Client   | `{ snapshot }`                           | Current batters or bowler changed mid-innings  |
