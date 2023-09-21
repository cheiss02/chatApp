const path = require("path");       //
const http = require("http");       //Initialize the http module is used by express
const express = require("express");     //Express server
const socketio = require("socket.io");      //
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require("./utils/users");


const app = express();                  //to initialize the server
const server = http.createServer(app);  //
const io = socketio(server);


// Set static folder to use the files saves on the public folder with join we join the current folder and then we specified the folder that we want to get it
app.use(express.static(path.join(__dirname, "public")));

const botName = 'Fitn3ss App';


//run when a client connects
io.on("connection", (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        //Create a user
        socket.join(user.room);
        

         //Welcome Current Users
        socket.emit('message', formatMessage(botName, "Welcome to Fitn3ss Chat!"));
        

        //Broadcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit(
            "message", 
        formatMessage(botName, `${user.username} has joined the chat`)
        );

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
   
    //Listen for chatMessage
    socket.on ('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

     //Runs when client disconect
     socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit(
                'message', 
                formatMessage(botName, `${user.username} has left the chat`)
            );

            //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        
        }

    });

});

const PORT = process.env.PORT || 3000;      //use a port to communicate and use port 3000 or any available


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));   //Listen to the port PORT and send a message as a confirmation