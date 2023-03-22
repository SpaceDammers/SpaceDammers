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
    // this.io.emit("join", roomPin);
    this.socket.emit("join", roomPin);
    console.log(`Joining room ${roomPin}...`);
    // Check if joined successfully
    this.socket.on("joined", (roomPin) => {
      console.log(`Joined room ${roomPin}`);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
