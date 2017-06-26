/**
 * Main application file
 */

'use strict';

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';
import seedDatabaseIfNeeded from './config/seed';
import routes from './routes';
import expressConfig from './config/express';

// Setup server
let app = express();
const server = http.createServer(app);

// Load configuration and routes
expressConfig(app); // this is where I redirect to HTTPS in production
routes(app);

// Start server
function startServer() {
  app.shy = server.listen(config.port, config.ip, () => {
    console.log(`Express listening on port ${config.port}, env = ${app.get('env')}`);
  });
}

// Sync the database which will seed it (if appropriate) then startServer
sqldb.sequelize.sync()
  .then(seedDatabaseIfNeeded) // Only if config.seed
  .then(startServer)
  .catch(err => console.log('Server failed to start due to error: ', err));

// Expose app
exports = module.exports = app;
