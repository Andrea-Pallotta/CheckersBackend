const uuid = require('uuid').v5;
const express = require('express');
const socket = require('socket.io');
const color = require('colors');
const cors = require('cors');
const config = require('./configs/configs')();
const db = require('./utilities/mongoConnect');

const app = express();

app.use(cors());

const server = app.listen(config.app.port, config.app.localhost, () => {
    console.log(`${config.app.localhost} running on port ${config.app.port}`);
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('join-room', ({ username, roomname }) => {
        const user = joinUser(socket.id, username, roomname);
        console.log(socket.id, '=id');
        socket.join(user.room);

        socket.emit('message', {
            userId: user.id,
            username: user.username,
            text: `Welcome ${user.username}`,
        });
    
        socket.broadcast.to(user.room).emit('message', {
            userId: user.id,
            username: user.username,
            text: `${user.username} joined the room`,
        });
    });

    socket.on('chat', (text) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', {
            userId: user.id,
            username: user.username,
            text: text,
        });
    });

    socket.on('disconnect', () => {
        io.to(user.room).emit('message', {
            userId: user.id,
            username: user.username,
            text: `${user.username} left the room`,
        })
    });
});


