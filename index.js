const express = require("express");
const cors = require("cors");
const config = require("./configs/configs")();
const db = require("./utilities/mongo.connect");
const endpoints = require("./utilities/endpoint.utilities");
const { createConnection } = require("./classes/connection.class");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = app.listen(config.app.port, config.app.localhost, () => {
  console.log(`${config.app.localhost} running on port ${config.app.port}`);
});

const io = require("socket.io")(server, {
  "reconnection limit": 1000,
  "max reconnection attempts": 20,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

createConnection(io);
