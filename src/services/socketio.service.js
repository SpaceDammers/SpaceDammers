import { io } from "socket.io-client";
import { useBordStore } from "@/stores/bord";

export default class SocketioService {
  socket;
  token;
  bord;

  // Constructor
  constructor(token) {
    this.token = token;
    this.socket = this.setupSocketConnection(token);
  }
  
  // Init store
  init() {
    this.bord = useBordStore();
  }

  // Setup socket connection
  setupSocketConnection(token) {
    this.socket = io(import.meta.env.VUE_APP_SOCKET_ENDPOINT || "http://localhost:4000", {
      auth: {
        token,
      },
    });
    console.log(`Connecting socket...`);

    // If connected successfully
    this.socket.on("connect", () => {
      console.log(`Connected to server`);
    });

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

  // Send reset to server
  resetGame() {
    this.socket.emit("reset");
    console.log(`Resetting game...`);
  }

  // Listen for reset from server
  onReset() {
    this.socket.on("reset", () => {
      this.bord.$reset();
      // console.log("reset", this.bord);
    });
  }

  sendBoardToServer(checkerPieces) {
    this.socket.emit("play", checkerPieces);
    console.log(`Sending board to server...`);
  }

  onBoardFromServer() {
    this.socket.on("play", (checkerPieces) => {
      console.log("Getting board from server...");
      return checkerPieces;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
