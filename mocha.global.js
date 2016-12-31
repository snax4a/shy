import app from './';
/* global after */
after(function(done) {
  // app.shy is undefined by the time the next line runs.
  app.shy.on('close', () => done());
  app.shy.close();
});
