/**
 * Main application routes
 */
'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  app.use('/api/token', require('./api/token'));
  app.use('/api/message', require('./api/message'));
  app.use('/api/order', require('./api/order'));
  app.use('/api/newsletter', require('./api/newsletter'));
  // app.use('/auth', require('./auth').default);

  // Return Apple's merchant ID domain association file
  app.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
    res.sendfile(path.resolve(`${app.get('serverPath')}/.well-known/apple-developer-merchantid-domain-association`));
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
