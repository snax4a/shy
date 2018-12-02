'use strict';

const express = require('express');
const sqldb = require('./sqldb');
const config = require('./config/environment');
const http = require('http');

// Setup server
let app = express();
const server = http.createServer(app);

// Load configuration and routes
require('./config/express').default(app); // handles HTTP -> HTTPS redirection
require('./routes').default(app);

// Start server
function startServer() {
  app.shy = server.listen(config.port, config.ip, () => {
    console.log(`Express Server listening on ${config.ip}:${config.port}, env = ${app.get('env')}`);
  });
}

// Sync the database which will seed it (if appropriate) then startServer
sqldb.sequelize.sync()
  .then(require('./config/seed').default) // Only if config.seed
  .then(startServer)
  .catch(err => console.log('Server failed to start due to error: ', err));

// Expose app
exports = module.exports = app;
