# Connect 4 WebSockets API

## Overview

This WebSockets API was created as the class project for ISTE-442. It's responsible for handling all the logic for the Connect 4 Web Application.

## Pre-requisites

- NodeJS `15.x.x` or later.
- npm `8.x.x` or later.
- latest `ubuntu`, `macOS`, `windows 10.x.x`.

# How to configure and run the server

1. Clone the project locally `git clone git@github.com:Andrea-Pallotta/Connect4Backend.git`
2. To run the code in your local environment, execute `npm run start:dev`
3. You won't be able to run `npm start` because it's solely used for the server on the EC2 instance.
   - You can modify the IP used by `npm start` in the file [./configs/configs.js](configs/configs.js#L6). 
   - If you modify the IP, make sure to modify the `production` IP in the frontend as well.
 
# How CI/CD works

- The `./.github/workflows/ci-cd.yml` contains all the CI/CD jobs.
- The server is deployed on the EC2 when there is a `pull_request` to `[ main ]`

# Project Dependencies

## Dependencies 
- [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify)
- [cors](https://github.com/expressjs/cors)
- [cross-env](https://github.com/kentcdodds/cross-env)
- [dotenv](https://github.com/motdotla/dotenv)
- [express](https://github.com/expressjs/express)
- [mongoose](https://github.com/Automattic/mongoose)
- [socket.io](https://github.com/socketio/socket.io)
- [socket.io-msgpack-parser](https://github.com/socketio/socket.io-msgpack-parser)
- [uuid](https://github.com/uuidjs/uuid)
- [wait-queue](https://github.com/flarestart/wait-queue)

## Dev Dependencies
- [eslint](https://github.com/eslint/eslint)
- [nodemon](https://github.com/remy/nodemon)