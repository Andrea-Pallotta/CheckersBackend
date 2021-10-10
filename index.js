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
    },
});

let interval;

io.on('connection', (socket) => {
    console.log('new client connected');
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => emitResponse(socket), 1000);
    socket.on('disconnect', () => {
        console.log('client disconnected');
        clearInterval(interval);
    });
});

const emitResponse = (socket) => {
    const response = new Date();
    socket.emit('from_api', response);
}


