const uuid = require('uuid').v5;
const express = require('express');
const color = require('colors');
const cors = require('cors');
const config = require('./configs/configs')();
const db = require('./utilities/mongoConnect');

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

let interval;

io.on('connection', (socket) => {
    console.log('new client connected');
    socket.emit('connection', null);

    socket.on('disconnect', () => {
        console.log('client disconnected');
        clearInterval(interval);
    });
});


