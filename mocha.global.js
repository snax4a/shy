/* global after */
import app from './';
import db from './server/sqldb';

after(done => {
  db.sequelize.close().then(() => console.log('Database connections closed.'));
  app.shy.on('close', () => done());
  app.shy.close();
});
