/* eslint no-process-exit:0 */
/* global after */
import app from './';

after(done => {
  app.shy.on('close', () => {
    done();
  });
  app.shy.close();
});
