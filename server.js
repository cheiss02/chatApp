const path = require("path");       //
const http = require("http");       //Initialize the http module is used by express
const express = require("express");     //Express server
const socketio = require("socket.io");      //

const app = express();                  //to initialize the server
const server = http.createServer(app);  //
const io = socketio(server);


// Set static folder to use the files saves on the public folder with join we join the current folder and then we specified the folder that we want to get it
app.use(express.static(path.join(__dirname, "public")));

//run when a client connects
io.on("connection", socket => {
    console.log('New WS Connection....');

    socket.emit('message', 'Welcome to chatCord!');
});

const PORT = process.env.PORT || 3000;      //use a port to communicate and use port 3000 or any available

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));   //Listen to the port PORT and send a message as a confirmation