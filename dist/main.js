"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Qs = __importStar(require("qs"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
if (!chatForm || !chatMessages || !roomName || !userList) {
    throw new Error('DOM elements not found.');
}
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const socket = (0, socket_io_client_1.default)();
socket.emit('joinRoom', { username, room });
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msgInput = chatForm.querySelector('input[name="msg"]');
        if (msgInput) {
            const msg = msgInput.value;
            socket.emit('chatMessage', msg);
            msgInput.value = '';
            msgInput.focus();
        }
    });
}
function outputMessage(message) {
    if (chatMessages) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
        chatMessages.appendChild(div);
    }
}
function outputRoomName(room) {
    if (roomName) {
        roomName.innerText = room;
    }
}
function outputUsers(users) {
    if (userList) {
        userList.innerHTML = `
      ${users.map((user) => `<li> ${user.username} </li>`).join('')}
    `;
    }
}
