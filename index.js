const uuid = require('uuid').v5;
const express = require('express');
const color = require('colors');
const cors = require('cors');
const config = require('./configs/configs')();
const db = require('./utilities/mongoConnect');
const { NEW_GLOBAL_CHAT_MESSAGE, GLOBAL_CHAT } = require('./utilities/endpoints');

const app = express();
app.use(cors());
const server = app.listen(config.app.port, config.app.localhost, () => {
    console.log(`${config.app.localhost} running on port ${config.app.port}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['Get', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`new client ${socket.id} connected`);

    socket.join(GLOBAL_CHAT);

    socket.on(NEW_GLOBAL_CHAT_MESSAGE, (data) => {
        io.in(GLOBAL_CHAT).emit(NEW_GLOBAL_CHAT_MESSAGE, data);
    });

    socket.on('disconnect', () => {
        socket.leave(GLOBAL_CHAT);
    });
});


