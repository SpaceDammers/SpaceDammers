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

io.on("connection", (socket) => {
    console.log("Socket.io user with id:", socket.id, "connected");

    socket.on("disconnect", () => {
        console.log("Socket.io user with id:", socket.id, "disconnected");
    });
});

io.on("connection", function (socket) {
    socket.on("join", function (roomName: string) {
        socket.join(roomName.toLowerCase());
        socket.emit("joined", roomName.toLowerCase());
        console.log("Socket.io user with id:", socket.id, "joined room:", roomName);
    });
});

app.get("/", (req: Request, res: Response) => {
    res.status(200);
});

httpServer.listen(port);
