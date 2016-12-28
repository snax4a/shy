import app from './';
/* global after */
after(done => {
  // app.shy is undefined by the time the next line runs.
  app.shy.on('close', () => done());
  app.shy.close();
});
