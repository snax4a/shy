/* global after */
import app from './';

after(function(done) {
  // Unit tests are completing before /server/app.js:25 is executed causing an error
  // Set the close handler after app.shy starts
  app.on('appStarted', () => {
    app.shy.on('close', () => done());
    app.shy.close();
  });
});
