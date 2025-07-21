// backend/src/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { io } from "./lib/socket.js";

dotenv.config();

// Set up __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Attach socket.io to the server
io.attach(server);

// ✅ Middleware for large payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ CORS settings
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 🍪 Cookie parser
app.use(cookieParser());

// 🔗 Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 🏭 Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// 🚀 Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDB();
});
