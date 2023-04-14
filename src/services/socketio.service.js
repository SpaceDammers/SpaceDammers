import { io } from "socket.io-client";

export default class SocketioService {
  socket;
  token;

  constructor(token) {
    this.token = token;
    this.socket = this.setupSocketConnection(token);
  }

  // Setup socket connection
  setupSocketConnection(token) {
    this.socket = io("http://localhost:4000", {
      auth: {
        token,
      },
    });
    console.log(`Connecting socket...`);

    this.socket.on("disconnect", () => {
      console.log(`Disconnected from socket`);
    });

    return this.socket;
  }

  // Join or create room
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

  // Send message to server
  sendMessage(message, roomPin, userName) {
    this.socket.emit("message", message, roomPin, userName);
    console.log(`Sending message: '${message}' to room '${roomPin}', by '${this.userName}'`);
  }

  // Listen for messages from server
  onMessage() {
    this.socket.on("message", (message, roomPin, userName) => {
      console.log(`Onmessage(), Received message: '${message}' in room '${roomPin}' from server, by '${userName}'`);
      return message;
    });
  }

  // Listen for move piece from server
  movePiece() {
    // 
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
