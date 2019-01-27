/* eslint no-process-env:0 no-process-exit:0 */
/* global console, setInterval, clearInterval, require, process, __dirname */
'use strict';

import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import opn from 'opn';
import path from 'path';
import dotenv from 'dotenv';
import shelljs from 'shelljs';
import { Server as KarmaServer } from 'karma';
import { protractor, webdriver_update } from 'gulp-protractor';
import { Instrumenter } from 'isparta';
import webpack from 'webpack';
import makeWebpackConfig from './webpack.make';

let plugins = gulpLoadPlugins();
let config;

// Defined paths
const clientPath = 'client';
const serverPath = 'server';
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [`${clientPath}/**/!(*.spec|*.mock).js`],
    styles: [`${clientPath}/app/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/app/**/*.pug`,
    mainView: `${clientPath}/index.html`,
    test: [`${clientPath}/app/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js']
  },
  server: {
    scripts: [`${serverPath}/**/!(*.spec|*.integration).js`],
    esm: `${serverPath}/**/!(*.spec|*.integration).mjs`, // not to be transpiled
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
    }
  },
  karma: 'karma.conf.js',
  dist: 'dist'
};

// Helper functions

// Run Gulp task in a process with debugging, warning and deprecation tracing
const gulpDebug = task => {
  console.log('TASK', task);
  let spawn = require('child_process').spawn;
  spawn('node', [
    '--inspect',
    '--trace-deprecation',
    '--trace-warnings',
    path.join(__dirname, 'node_modules/gulp/bin/gulp.js'),
    task
  ], { stdio: 'inherit' });
};

// Log to console
function onServerLog(log) {
  console.log(plugins.util.colors.white('[')
    + plugins.util.colors.yellow('nodemon')
    + plugins.util.colors.white('] ')
    + log.message);
}

// Perform HTTP GET to check for app readiness
function checkAppReady(cb) {
  let options = {
    host: 'localhost',
    port: config.port
  };
  http.get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Check every 250ms until app server is ready
function whenServerReady(cb) {
  let serverReady = false;
  let appReadyInterval = setInterval(() =>
    checkAppReady(ready => {
      if(!ready || serverReady) {
        return;
      }
      clearInterval(appReadyInterval);
      serverReady = true;
      cb();
    }),
  250);
}

// Reusable pipelines

const eslintClient = lazypipe()
  .pipe(plugins.eslint, `${clientPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

const eslintClientTests = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${clientPath}/.eslintrc`,
    envs: [
      'browser',
      'es6',
      'mocha'
    ]
  })
  .pipe(plugins.eslint.format);

const eslintServer = lazypipe()
  .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

const eslintServerTests = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${serverPath}/.eslintrc`,
    envs: [
      'node',
      'es6',
      'mocha'
    ]
  })
  .pipe(plugins.eslint.format);

// Use gulp-babel to process ES6 for nodeJS server, gets babelrc from package.json
const transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel)
  .pipe(plugins.sourcemaps.write, '.');

// Execute mocha tests
const mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 15000,
    require: ['./mocha.conf']
  });

// Generate coverage information
const istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: './coverage',
    rootDirectory: ''
  });

// Read the .env file at the project root to set process.env
gulp.task('env:common', done => {
  dotenv.config();
  done();
});

// Change NODE_ENV to 'test'
gulp.task('env:test', done => {
  process.env.NODE_ENV = 'test';
  done();
});

// Add imports of all SCSS files to bottom of client/app/app.scss and return stream
gulp.task('inject:scss', () =>
  gulp.src(paths.client.mainStyle)
    .pipe(plugins.inject(
      gulp.src(
        [...paths.client.styles, `!${paths.client.mainStyle}`],
        { read: false }
      )
        .pipe(plugins.sort()), {
        transform: filepath => {
          let newPath = filepath
            .replace(`/${clientPath}/app/`, '')
            .replace(/_(.*).scss/, (match, p1/*, offset, string*/) => p1)
            .replace('.scss', '');
          return `@import '${newPath}';`;
        }
      }))
    .pipe(gulp.dest(`${clientPath}/app`))
);

// Use Webpack to build and output to dist
gulp.task('webpack:dist', done => {
  let compiler = webpack(makeWebpackConfig({ BUILD: true }));
  compiler.run((err, stats) => {
    if(err) return done(err);
    plugins.util.log(stats.toString({
      assets: true,
      cached: false,
      cachedAssets: false,
      children: false,
      colors: true,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      depth: false,
      env: false,
      errors: true,
      errorDetails: true,
      hash: false,
      modules: false,
      performance: true,
      reasons: false,
      timings: false, // Redundant since gulp provides timing
      warnings: false
    }));
    done();
  });
});

// Minimal transpiliation since we're using nodeJS > 7 (mainly imports)
gulp.task('transpile:server', () =>
  gulp.src(paths.server.scripts)
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`))
);

// eslint client scripts (but not tests)
gulp.task('eslint:client', done => {
  gulp.src(
    [
      ...paths.client.scripts,
      ...paths.client.test.map(blob => `!${blob}`)
    ]
  )
    .pipe(eslintClient());
  done();
});

// eslint server scripts (but not tests)
gulp.task('eslint:server', done => {
  gulp.src(
    [
      ...paths.server.scripts,
      ...paths.server.test.integration.map(blob => `!${blob}`),
      ...paths.server.test.unit.map(blob => `!${blob}`)
    ]
  )
    .pipe(eslintServer());
  done();
});

// eslint server and client scripts (but not tests)
gulp.task('eslint', done => {
  gulp.parallel('eslint:client', 'eslint:server');
  done();
});

// eslint client tests
gulp.task('eslint:client:tests', () =>
  gulp.src(paths.client.test)
    .pipe(eslintClientTests())
);

// eslint server tests
gulp.task('eslint:server:tests', () =>
  gulp.src(paths.server.test)
    .pipe(eslintServerTests())
);

// eslint client and server tests
gulp.task('eslint:tests', done => {
  gulp.parallel('eslint:client:tests', 'eslint:server:tests');
  done();
});

// Delete files in .tmp
gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));

// Wait until server is responding then open browser on client to our starting page
gulp.task('start:client', done => {
  whenServerReady(() => {
    opn(`http://localhost:${config.browserSyncPort}`);
    done();
  });
});

// Start server in development or test mode
gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`).default;
  nodemon(`--inspect --trace-deprecation --trace-warnings -w ${serverPath} ${serverPath}`)
    .on('log', onServerLog);
});

// Aside from watching for server changes, closest thing to production
gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/${serverPath}/config/environment`).default;
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog);
});

// Watch for changes on server and eslint files
gulp.task('watch', () => {
  plugins.watch([
    ...paths.server.scripts
  ])
    .pipe(plugins.plumber())
    .pipe(eslintServer());

  plugins.watch([
    ...paths.server.test.unit,
    ...paths.server.test.integration
  ])
    .pipe(plugins.plumber())
    .pipe(eslintServerTests());
});

// Delete everything from dist folder
gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|Procfile)**`], { dot: true }));

// Filtes to copy to dist/client without processing
gulp.task('copy:dist:client', () =>
  gulp.src([
    `${clientPath}/favicon.png`,
    `${clientPath}/favicon.ico`,
    `${clientPath}/sitemap.xml`,
    `${clientPath}/apple-touch-icon.png`,
    `${clientPath}/apple-touch-icon-120.png`,
    `${clientPath}/leta.html`,
    `${clientPath}/robots.txt`,
    `${clientPath}/.well-known/*`,
    paths.client.assets,
    `!${paths.client.images}`
  ], { dot: true, base: `${clientPath}/` })
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
);

// Copy FontAwesome woff2 and woff fonts to dist/assets/fonts
gulp.task('copy:fonts', () =>
  gulp.src([
    'node_modules/@fortawesome/fontawesome-free/webfonts/*.woff*'
  ])
    .pipe(gulp.dest(`${clientPath}/assets/fonts`))
);

// Files to copy to dist without processing
gulp.task('copy:dist', () =>
  gulp.src([
    'package*.json', // package.json and package-lock.json
  ], { cwdbase: true })
    .pipe(gulp.dest(paths.dist))
);

// Files to copy to dist/server without processing
gulp.task('copy:dist:server', () =>
  gulp.src([
    paths.server.esm
  ], { cwdbase: true })
    .pipe(gulp.dest(paths.dist))
);

// Shrink images and output cache-busted names
gulp.task('build:images', () =>
  gulp.src(paths.client.images)
    .pipe(plugins.imagemin([
      plugins.imagemin.optipng({ optimizationLevel: 5 }),
      plugins.imagemin.jpegtran({ progressive: true }),
      plugins.imagemin.gifsicle({ interlaced: true }),
      plugins.imagemin.svgo({plugins: [{ removeViewBox: false }]})
    ]))
    // Rename images to avoid browser caching
    .pipe(plugins.rev())
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
    .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
      base: `${paths.dist}/${clientPath}/assets`,
      merge: true
    }))
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
);

// Update references to images with cache-busted names
gulp.task('image:cache-busting', () =>
  gulp.src([
    `${paths.dist}/${clientPath}/app.*.js`,
    `${paths.dist}/${clientPath}/leta.html`,
    `${paths.dist}/${clientPath}/assets/data/*.json`
  ], { base: `${paths.dist}/${clientPath}` })
    .pipe(plugins.revReplace({
      replaceInExtensions: ['.html', '.js', '.json'],
      manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)
    }))
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
);

// Create the build in dist
gulp.task('build',
  gulp.series(
    gulp.parallel('clean:dist', 'clean:tmp'),
    'inject:scss',
    'transpile:server',
    'build:images',
    'copy:fonts',
    gulp.parallel('copy:dist', 'copy:dist:server', 'copy:dist:client', 'webpack:dist'),
    'image:cache-busting'
  )
);

// Run nodemon with debugging (server/config/express.js runs webpack.make.js)
gulp.task('serve',
  gulp.series(
    gulp.parallel('clean:tmp', 'eslint', 'eslint:tests', 'inject:scss', 'copy:fonts', 'env:common'),
    gulp.parallel('start:server', 'start:client'),
    'watch'
  )
);

// Run server unit tests using MochaJS
gulp.task('test:server:unit', () =>
  gulp.src(paths.server.test.unit)
    .pipe(mocha())
);

// Run server integration tests using MochaJS and supertest
gulp.task('test:server:integration', () =>
  gulp.src(paths.server.test.integration)
    .pipe(mocha())
);

// Run server unit and integration tests
gulp.task('test:server', gulp.series('env:common', 'env:test', 'test:server:unit', 'test:server:integration'));

// Run client tests using Karma and Protractor
gulp.task('test:client', done => {
  new KarmaServer({
    configFile: `${__dirname}/${paths.karma}`,
    singleRun: true
  }, exitCode => {
    console.log(`Karma Server exited with code: ${exitCode}`);
    done(exitCode);
    process.exit(exitCode);
  }).start();
});

// Run all tests
gulp.task('test', gulp.series('eslint:tests', 'test:server', 'test:client'));

// Run tests in debug mode
gulp.task('debug:test', done => {
  gulpDebug('test');
  done();
});

// Run build in debug mode
gulp.task('debug:build', done => {
  gulpDebug('build');
  done();
});

// Broken
// // Baseline scripts to examine for coverage
// gulp.task('coverage:pre', () =>
//   gulp.src(paths.server.scripts)
//     // Covering files
//     .pipe(plugins.istanbul({
//       instrumenter: Instrumenter, // Use the isparta instrumenter for ES6 code coverage
//       includeUntested: true
//     }))
//     // Force `require` to return covered files
//     .pipe(plugins.istanbul.hookRequire())
// );

// // Look at unit test coverage
// gulp.task('coverage:unit', done => {
//   gulp.src(paths.server.test.unit)
//     .pipe(mocha())
//     .pipe(istanbul());
//   done();
// });

// // Look at integration test coverage
// gulp.task('coverage:integration', done => {
//   gulp.src(paths.server.test.integration)
//     .pipe(mocha())
//     .pipe(istanbul());
//   done();
// });

// // Run coverage analysis on server tests
// gulp.task('test:server:coverage', gulp.series('coverage:pre', 'env:common', 'env:test', 'coverage:unit', 'coverage:integration'));

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// Run end-to-end testing
gulp.task('test:e2e', gulp.parallel('webpack:dist', 'env:common', 'env:test', 'start:server', 'webdriver_update'), () => {
  gulp.src(paths.client.e2e)
    .pipe(protractor({
      configFile: 'protractor.conf.js',
    }))
    .on('error', e => {
      throw e;
    })
    .on('end', () => {
      process.exit();
    });
});

// Push build to Heroku via git
gulp.task('deploy', done => {
  shelljs.cd(paths.dist); // Set our working directory

  // If there are no changes, skip commit
  if(shelljs.exec('git status --porcelain', {silent: true}).output === '') {
    console.log('No differences detected. Skipping commit.');
    return;
  }
  // There were changes, go ahead...
  console.log('Deploying changes to Heroku...');
  shelljs.exec('git add -A . && git commit -m deploy && git push --force heroku master');
  done();
});
