let express = require('express');
let serverRouter = require('./routes/server-route');
let server = express();
//server.use(express.static(__dirname + '/public'));

server.use(serverRouter);

module.exports = server;
