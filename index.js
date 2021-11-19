const express = require("express");
const cors = require("cors");
const config = require("./configs/configs")();
// const db = require("./utilities/mongo.connect");
// const endpoints = require("./utilities/endpoint.utilities");
const { createConnection } = require("./classes/connection.class");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

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
  parser: require("socket.io-msgpack-parser"),
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(async (socket, next) => {
  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: socket.handshake.auth.token.payload.iss.split("/")[3],
      tokenUse: "access",
      clientId: socket.handshake.auth.token.payload.client_id,
    });
    await verifier.verify(socket.handshake.auth.token.jwtToken);
  } catch (err) {
    console.log("Validation failed");
  }
  next();
});

createConnection(io);
