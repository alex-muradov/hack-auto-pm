// hooks/use-socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001", {
  transports: ["websocket"],
  autoConnect: true,
});

// 👇 Добавь это, чтобы видеть socket в браузере
if (typeof window !== "undefined") {
  (window as any).socket = socket;
}

export default socket;