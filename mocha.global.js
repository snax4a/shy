/* eslint no-process-exit:0 */
/* global after */
import app from './';
import db from './server/sqldb';

after(done => {
  app.shy.on('close', () => {
    db.sequelize.close().then(() => {
      done();
      process.exit(); // Needed for now since one of the mocha unit tests are hanging
    });
  });
  app.shy.close();
});
