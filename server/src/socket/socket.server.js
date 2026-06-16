import { Server } from "socket.io";
import env from "../shared/config/env.config.js";
import logger from "../shared/config/logger.config.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");

    socket.on("match:join", ({ matchId }, callback) => {
      if (typeof matchId === "string" && matchId.length > 0) {
        socket.join(`match:${matchId}`);
        logger.info({ socketId: socket.id, matchId }, "Socket joined match room");
        if (typeof callback === "function") {
          callback({ success: true, room: `match:${matchId}` });
        }
      } else {
        logger.warn({ socketId: socket.id, matchId }, "Invalid matchId on match:join");
        if (typeof callback === "function") {
          callback({ success: false, error: "Invalid matchId" });
        }
      }
    });

    socket.on("match:leave", (matchId, callback) => {
      if (typeof matchId === "string" && matchId.length > 0) {
        socket.leave(`match:${matchId}`);
        logger.info({ socketId: socket.id, matchId }, "Socket left match room");
        if (typeof callback === "function") {
          callback({ success: true });
        }
      } else {
        if (typeof callback === "function") {
          callback({ success: false, error: "Invalid matchId" });
        }
      }
    });

    socket.on("chat:send", (payload = {}, callback) => {
      const matchId = typeof payload.matchId === "string" ? payload.matchId.trim() : "";
      const text = typeof payload.text === "string" ? payload.text.trim().slice(0, 280) : "";
      const name = typeof payload.name === "string" && payload.name.trim()
        ? payload.name.trim().slice(0, 40)
        : "Fan";

      if (!matchId || !text) {
        if (typeof callback === "function") {
          callback({ success: false, error: "Message is required" });
        }
        return;
      }

      const message = {
        id: `${Date.now()}-${socket.id}`,
        matchId,
        name,
        text,
        likes: 0,
        createdAt: new Date().toISOString(),
      };

      io.to(`match:${matchId}`).emit("chat:message", message);
      if (typeof callback === "function") {
        callback({ success: true, message });
      }
    });

    socket.on("disconnect", () => {
      logger.info({ socketId: socket.id }, "Socket disconnected");
    });
  });

  return io;
};

export const emitMatchEvent = (matchId, event, payload) => {
  if (!io) {
    logger.warn({ matchId, event }, "Socket not initialized — event dropped");
    return;
  }
  io.to(`match:${matchId}`).emit(event, payload);
};

export default initializeSocket;
