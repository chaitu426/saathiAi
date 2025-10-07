import app from "./app.js";
import http from "http";
import {environment} from "./config/environment.js";
import { initSocket } from "./workers/socket.js";
const PORT = environment.port;

// Create HTTP + Socket.io server
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

