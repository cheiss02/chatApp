//Create a variable to bring the DOM element. getting this info from the chat.html line 48
// <form id="chat-form">
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from the URL using qs library https://cdnjs.com/libraries/qs
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});




//We have access to io because of the script that we have at the end of the chat.html
const socket = io();

//JoinChatroom
socket.emit('joinRoom', { username, room });

//get Room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit. add a event listener
chatForm.addEventListener('submit', e =>{
    e.preventDefault();

        //Get message text
    const msg = e.target.elements.msg.value;

    //Emiting the message to the server
    socket.emit('chatMessage', msg);

    //Clear the input when the user send the message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//Output Message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li> ${user.username} </li>`).join('')}
    `;
}