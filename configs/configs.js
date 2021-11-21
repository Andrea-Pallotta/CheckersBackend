require("dotenv").config();

module.exports = () => ({
  app: {
    name: "Connect4 Server",
    host: process.env.NODE_ENV === "production" ? "172.31.17.228" : "127.0.0.1",
    port: 5050,
    logspath: "./logs/logs.txt",
  },
});
