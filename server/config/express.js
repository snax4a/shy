/**
 * Express configuration
 */

'use strict';

import express from 'express';
import morgan from 'morgan';
import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import sqldb from '../sqldb';
import mime from 'mime-types';

export default function(app) {
  let env = app.get('env');
  let Store = require('connect-session-sequelize')(session.Store);

  if(env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }

  if(env === 'production') {
    // Force HTTPS for production only (though would be good for dev too)
    app.use((req, res, next) => {
      if(req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`${config.domain}${req.url}`);
      } else { // request was via http, so redirect to https
        next();
        return null;
      }
    });
    // Use gzip compression in production
    app.use(shrinkRay());
    // If we decide to pre-compress content in the future
    // app.get('*.js', (req, res, next) => {
    //   req.url = `${req.url}.gz`;
    //   res.set('Content-Encoding', 'gzip');
    //   return next();
    // });
  }

  app.set('appPath', path.join(config.root, 'client'));

  // Set Cache-Control to 1y unless it's an HTML file
  app.use(express.static(app.get('appPath'), {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if(mimeType === 'text/html' || mimeType == 'application/json') res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }));

  app.use(morgan('dev')); // middleware logger

  // Server-side views only
  // app.set('views', `${config.root}/server/views`);
  // app.set('view engine', 'pug');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  //app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new Store({db: sqldb.sequelize})
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if(env !== 'test' /*&& !process.env.PERFECTO_USERNAME*/) {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
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
    const makeWebpackConfig = require('../../webpack.make');
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
    compiler.plugin('done', stats => {
      console.log('webpack done hook');
      if(stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
          title: 'Webpack Error:',
          body: stripAnsi(stats.toString()),
          timeout: 100000
        });
      }
      browserSync.reload();
    });
  }

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
