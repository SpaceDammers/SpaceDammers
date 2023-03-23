import { io } from "socket.io-client";

export default class SocketioService {
  socket;
  token;

  constructor(token) {
    this.token = token;
    this.socket = this.setupSocketConnection(token);
  }

  setupSocketConnection(token) {
    this.socket = io("http://localhost:4000", {
      auth: {
        token,
      },
    });
    console.log(`Connecting socket...`);
    return this.socket;
  }

  joinRoom(roomPin) {
    return new Promise((resolve) => {
      // Try to join room
      this.socket.emit("join", roomPin);
      console.log(`Joining room ${roomPin}...`);

      // If joined successfully
      this.socket.on("joined", (roomPin) => {
        console.log(`Joined room ${roomPin}`);
        resolve(true);
      });

      // If room is full
      this.socket.on("full", (roomPin) => {
        console.log(`Room ${roomPin} is full`);
        resolve(false);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
