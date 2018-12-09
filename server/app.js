'use strict';

const express = require('express');
const sqldb = require('./sqldb');
const config = require('./config/environment');

// Setup server
let app = express();

// Load configuration then routes
require('./config/express').default(app); // handles HTTP -> HTTPS redirection
require('./routes').default(app);

// Start server
function startServer() {
  app.shy = app.listen(config.port, () => {
    console.log(`Express Server (${app.get('env')}) - Open your browser to ${config.domain}`);
  });
}

// Sync the database which will seed it (if appropriate) then startServer
sqldb.sequelize.sync()
  .then(require('./config/seed').default) // Only if config.seed
  .then(startServer)
  .catch(err => console.log('Server failed to start due to error: ', err));

// Expose app
exports = module.exports = app;
