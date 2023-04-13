import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    allowEIO3: true,
    cors: {
        methods: ["GET", "POST"],
        credentials: true,
        origin: ['http://localhost:3000']
    },
});

// When a user connects to the server
io.on("connection", (socket) => {
    console.log("Socket.io user with id:", socket.id, "connected");

    socket.on("disconnect", () => {
        console.log("Socket.io user with id:", socket.id, "disconnected");
    });
});

// When a user joins a room
io.on("connection", function (socket) {
    socket.on("join", function (roomName: string) {
        // Set variables
        const room = io.sockets.adapter.rooms.get(roomName.toLowerCase())?.size;
        const lowerCaseRoomName = roomName.toLowerCase();

        // If there are 2 users in the room, don't let a third user join
        if (room === 2) {
            socket.emit("full", lowerCaseRoomName);
            console.log("Socket.io user with id:", socket.id, "tried to join full room:", lowerCaseRoomName);
            return false;
        } else if (room === 1 || room === 0) {
            socket.join(lowerCaseRoomName);
            socket.emit("joined", lowerCaseRoomName);
            console.log("Socket.io user with id:", socket.id, "joined room:", lowerCaseRoomName);
            return true;
        } else if (room === undefined) {
            socket.join(lowerCaseRoomName);
            socket.emit("joined", lowerCaseRoomName);
            console.log("Socket.io user with id:", socket.id, "created room:", lowerCaseRoomName);
            return true;
        }
    });
});

// Webclient backend
app.get("/", (req: Request, res: Response) => {
    res.status(200);
});

httpServer.listen(port);
