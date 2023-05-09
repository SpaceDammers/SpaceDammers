const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log('a user connected')

    socket.emit("hello", "Hallo babi");

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', { id: socket.id, msg: msg });
    })

    socket.on("play", index => { //als je dit ontvangt doe dan dit , landa expressie, (hij gaat code uitvoeregn inplaats van een functie?), als je de functie play ontvangt met een index doe deze code
        console.log("Zet is gezet")
        socket.broadcast.emit("play", index) //broadcast doet die naar alle andere clients behalve zich zelf
    })

    socket.on("reset", () => { //moet je de naam van iets inzetten en dan de functie, nu is functie zonder naam.
        socket.broadcast.emit("reset") //broadcast doet die naar alle andere clients behalve zich zelf

        socket.broadcast.emit('message', {
            id: "server",
            msg: "Het bord is gereset"
        });

        console.log("reset");
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
})

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});