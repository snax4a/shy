// Main application routes
import path from 'path';
import TokenApi from './api/token';
import AnnouncementApi from './api/announcement';
import ScheduleApi from './api/schedule';
import OrderApi from './api/order';
import UserApi from './api/user';
import HistoryApi from './api/history';
import Auth from './auth';

export default app => {
  app.use('/api/token', TokenApi);
  app.use('/api/announcement', AnnouncementApi);
  app.use('/api/schedule', ScheduleApi);
  app.use('/api/order', OrderApi);
  app.use('/api/user', UserApi);
  app.use('/api/history', HistoryApi);
  app.use('/auth', Auth);

  // Return Apple's merchant ID domain association file
  app.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
    res.sendfile(path.resolve(`${app.get('appPath')}/apple-developer-merchantid-domain-association`));
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|middleware|app|assets)/*')
    .get((req, res) => res.status(404).send({ message: `${req.url} not found.` }));

  // Alternate 404 handler - seems overblown
  // function pageNotFound(req, res) {
  //   const viewFilePath = '404';
  //   const statusCode = 404;
  //   const result = {
  //     status: statusCode
  //   };
  //   res.status(result.status);
  //   res.render(viewFilePath, {}, (err, html) => {
  //     if(err) {
  //       return res.status(result.status).send(result);
  //     }
  //     return res.send(html);
  //   });
  // }

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      const fqdn = req.get('host');
      const startingPoint = fqdn.includes('leta.guru') ? 'leta' : 'index';
      res.sendFile(path.resolve(`${app.get('appPath')}/${startingPoint}.html`));
    });

  // Global error-handler
  /* eslint no-unused-vars: 0 */
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Something unexpected happened';
    const errors = err.errors || [];
    // console.error(`\x1b[31mERROR ${status}: ${message}`); // Debugging only
    res.statusMessage = message;
    res.status(status).send({ status, message, errors });
  });
};
