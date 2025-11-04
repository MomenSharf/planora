import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // in production use your Next.js domain instead
    methods: ["GET", "POST"],
  },
});

// --- Realtime logic ---
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join workspace or project rooms
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Broadcast task updates
  socket.on("task:update", (data) => {
    io.to(data.projectId).emit("task:updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Realtime server running on port ${PORT}`);
});
