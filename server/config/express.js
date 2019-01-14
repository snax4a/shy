// Express configuration

import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import morgan from 'morgan';
import compression from 'compression';
import errorHandler from 'errorhandler'; // only used in dev/test
import path from 'path';
import lusca from 'lusca';
import passport from 'passport';
import session from 'express-session';
import mime from 'mime-types';
import config from './environment';
import db from '../utils/db';

export default app => {
  let env = app.get('env'); // process.env.NODE_ENV or config.env

  // Only enable the logger for development since it's too messy during testing and heroku has its own
  if(env === 'development') app.use(morgan('dev')); // middleware logger

  if(env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(require('cors')());
  }

  if(env === 'production') {
    // Force HTTPS for production only (though would be good for dev too)
    app.use((req, res, next) => {
      if(req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`${config.domain}${req.url}`);
      } else { // request was via http, so redirect to https
        return next();
      }
    });
  }

  app.set('appPath', path.join(config.root, 'client'));
  if(env === 'production') {
    // Send pre-compressed .gz or .br files if they exist
    app.use('/', expressStaticGzip(app.get('appPath')));
  }

  // Set Cache-Control to 1d unless it's an HTML file
  app.use(express.static(app.get('appPath'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if(mimeType === 'text/html' || mimeType == 'application/json') res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }));

  // Server-side views only (and we don't currently have any)
  app.set('views', `${config.root}/server/views`);
  app.set('view engine', 'pug');

  app.use(compression());

  // Persist sessions in database
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: db.store
  }));

  // Support JSON in req.body
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Initialize the passport
  app.use(passport.initialize());

  // Setup passport sessions
  app.use(passport.session()); // ADDED (is it needed?)

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if(env !== 'development' && env !== 'test') {
    app.use(lusca({
      csrf: {
        angular: true // only applies to AngularJS
        // header: 'x-xsrf-token' // new angular fullstack
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  if(env === 'development') {
    // Conditional imports
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const stripAnsi = require('strip-ansi');
    const webpack = require('webpack');
    const makeWebpackConfig = require('../../webpack.make').default;
    const webpackConfig = makeWebpackConfig({ DEV: true });
    const compiler = webpack(webpackConfig);
    const browserSync = require('browser-sync').create();

    /**
     * Run Browsersync and use middleware for Hot Module Replacement
     */
    browserSync.init({
      open: false,
      logFileChanges: false,
      proxy: `localhost:${config.port}`,
      ws: true,
      middleware: [
        webpackDevMiddleware(compiler, {
          noInfo: false,
          stats: {
            colors: true,
            timings: true,
            chunks: false
          }
        })
      ],
      port: config.browserSyncPort,
      plugins: ['bs-fullscreen-message']
    });

    /**
     * Reload all devices when bundle is complete
     * or send a fullscreen error message to the browser instead
     */
    compiler.hooks.done.tap('ReloadDevices', stats => {
      if(stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
          title: 'Webpack Error:',
          body: stripAnsi(stats.toString()),
          timeout: 100000 // 100 seconds
        });
      }
      browserSync.reload();
    });
  }

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
};
