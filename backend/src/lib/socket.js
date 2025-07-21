// backend/src/lib/socket.js

import { Server } from "socket.io";

// Create and export io instance
export const io = new Server({
  cors: {
    origin: "*", // Use your frontend URL if needed
    methods: ["GET", "POST"]
  }
});

// User ID -> Socket ID map
const userSocketMap = new Map();

// ✅ Exported function
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId);
};

// Exported helper (optional)
export const addUserSocket = (userId, socketId) => {
  userSocketMap.set(userId, socketId);
};

// Setup socket.io events
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("🔌 Socket connected:", socket.id, "for user:", userId);

  if (userId) userSocketMap.set(userId, socket.id);

  socket.on("disconnect", () => {
    for (const [key, value] of userSocketMap.entries()) {
      if (value === socket.id) {
        userSocketMap.delete(key);
        break;
      }
    }
    console.log("❌ Socket disconnected:", socket.id);
  });
});
