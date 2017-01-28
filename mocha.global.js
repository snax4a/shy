/* global after */
import app from './';

after(function(done) {
  app.shy.on('close', () => done());
  app.shy.close();
});
