/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  // app.get('*', (req, res, next) => {
  //   if(req.headers['x-forwarded-proto']!='https') {
  //     res.redirect(`https://${config.fqdn}${req.url}`);
  //   } else {
  //     next(); // Continue to other routes if we're not redirecting
  //   }
  // });
  app.use('/api/token', require('./api/token'));
  app.use('/api/message', require('./api/message'));
  app.use('/api/order', require('./api/order'));
  app.use('/api/newsletter', require('./api/newsletter'));
  // app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
