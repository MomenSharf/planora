import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:4000"
);
