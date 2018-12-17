// Main application routes

'use strict';

import path from 'path';

export default function(app) {
  app.use('/api/token', require('./api/token'));
  app.use('/api/announcement', require('./api/announcement'));
  app.use('/api/schedule', require('./api/schedule'));
  app.use('/api/message', require('./api/message'));
  app.use('/api/order', require('./api/order'));
  app.use('/api/newsletter', require('./api/newsletter'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/history', require('./api/history'));
  app.use('/auth', require('./auth').default);

  // Return Apple's merchant ID domain association file
  app.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
    res.sendfile(path.resolve(`${app.get('appPath')}/apple-developer-merchantid-domain-association`));
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|middleware|app|assets)/*')
    .get((req, res) => res.status(404).send({ message: `${req.url} not found.` }));

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      const fqdn = req.get('host');
      const startingPoint = fqdn.includes('leta.guru') ? 'leta' : 'index';
      res.sendFile(path.resolve(`${app.get('appPath')}/${startingPoint}.html`));
    });

  // 500 - Any server error
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Something unexpected happened';
    const errors = err.errors || [];
    console.error(`\x1b[31mERROR ${status}: ${message}`);
    res.statusMessage = message;
    res.status(status).send({ status, message, errors });
  });
}
