import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
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
        // if there are 2 users in the room, don't let the user join
        if (io.sockets.adapter.rooms.get(roomName.toLowerCase())?.size === 2) {
            socket.emit("full", roomName.toLowerCase());
            console.log("Socket.io user with id:", socket.id, "tried to join full room:", roomName);
            return false;
        } else if (io.sockets.adapter.rooms.get(roomName.toLowerCase())?.size === 1 || io.sockets.adapter.rooms.get(roomName.toLowerCase())?.size === 0) {
            socket.join(roomName.toLowerCase());
            socket.emit("joined", roomName.toLowerCase());
            console.log("Socket.io user with id:", socket.id, "joined room:", roomName);
            return true;
        } else if (io.sockets.adapter.rooms.get(roomName.toLowerCase())?.size === undefined) {
            socket.join(roomName.toLowerCase());
            socket.emit("joined", roomName.toLowerCase());
            console.log("Socket.io user with id:", socket.id, "created room:", roomName);
            return true;
        }
    });
});

// Webclient backend
app.get("/", (req: Request, res: Response) => {
    res.status(200);
});

httpServer.listen(port);
