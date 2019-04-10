let express = require('express');
let serverRouter = require('./routes/server-route');
let server = express();

server.use(serverRouter);

module.exports = server;
