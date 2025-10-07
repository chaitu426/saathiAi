// src/queue/socket.js
import { Server } from "socket.io";

let io:any;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"], // <-- add frontend URLs
        methods: ["GET", "POST"],
        credentials: true,
      },
  });

  io.on("connection", (socket: any) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    socket.on("disconnect", () => console.log(`❌ Client disconnected: ${socket.id}`));
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
