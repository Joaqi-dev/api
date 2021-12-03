var express = require("express");
const { ExpressPeerServer } = require("peer");
var app = express();
const server = require("http").Server(app);
var router = express.Router();
const peerServer = ExpressPeerServer(server, {debug: true,});
const io = require("socket.io")(server);

app.use("/peerjs", peerServer);


router.get("/", function(req, res, next){
    io.on("connection", (socket) => {
        console.log("trying to connect...");
        socket.on("join-room", (roomId, userId, userName) => {
            socket.join(roomId);
            socket.to(roomId).broadcast.emit("user-connected", userId);
            console.log("connected");
});
});
});

module.exports = router;