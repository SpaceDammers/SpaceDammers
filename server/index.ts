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

// server-side
io.on("connection", (socket) => {
    console.log(socket.id);
});

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

httpServer.listen(port);