/**
 * Main application file
 */

'use strict';

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';

// Populate databases with sample data (if appropriate)
if(config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = http.createServer(app);

// Load configuration and routes
require('./config/express').default(app); // this is where I redirect to HTTPS in production
require('./routes').default(app);

// Start server
function startServer() {
  app.shy = server.listen(config.port, config.ip, function() {
    console.log(`Express listening on port ${config.port}, env = ${app.get('env')}`);
    app.emit('appStarted'); // So mocha.global.js doesn't try to complete after all until Express starts
  });
}

// Synch the database which will seed it (if appropriate) then startServer
sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log(`Server failed to start due to error: ${err}`);
  });

// Expose app
exports = module.exports = app;
