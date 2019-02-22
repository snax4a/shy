/* eslint no-process-env:0 no-process-exit:0 */
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
import webpack from 'webpack';

import { stream as favicons, config as faviconsConfig } from 'favicons';
import fancyLog from 'fancy-log';

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
    svgIcon: `${clientPath}/assets/images/seal.svg`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [`${clientPath}/**/!(*.spec|*.mock|*.test).js`],
    styles: [`${clientPath}/app/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    test: [`${clientPath}/app/**/*.{spec,mock,test}.js`]
  },
  server: {
    scripts: [`${serverPath}/**/!(*.spec|*.integration|*.test).js`],
    esm: `${serverPath}/**/!(*.spec|*.integration|*.test).mjs`, // not to be transpiled
    test: {
      integration: [`${serverPath}/**/*.int.test.js`],
      unit: [`${serverPath}/**/*.spec.js`]
    }
  },
  dist: 'dist'
};

// Helper functions

// Run Gulp task in a process with debugging, warning and deprecation tracing
const gulpDebug = task => {
  console.log('TASK', task);
  let spawn = require('child_process').spawn;
  spawn('node', [
    '--inspect-brk',
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
      'jest'
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
      'jest'
    ]
  })
  .pipe(plugins.eslint.format);

// Use gulp-babel to process ES6 for nodeJS server, gets babelrc from package.json
const transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel)
  .pipe(plugins.sourcemaps.write, '.');

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
  let compiler = webpack(makeWebpackConfig('production'));
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

// Wait until server is responding then open browser on client to our starting page
gulp.task('start:client', done => {
  whenServerReady(() => {
    opn(`http://localhost:${config.browserSyncPort}`/*, {app: 'google chrome'}*/);
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

// Files to copy to dist/client without processing
gulp.task('copy:dist:client', () =>
  gulp.src([
    `${clientPath}/sitemap.xml`,
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

// Generate icons from an SVG (could use sharp instead)
gulp.task('build:icons', () => {
  faviconsConfig.icons.android = {
    'android-chrome-192x192.png': {
      width: 192,
      height: 192,
      transparent: true,
      rotate: false,
      mask: false
    },
    'android-chrome-512x512.png': {
      width: 512,
      height: 512,
      transparent: true,
      rotate: false,
      mask: false
    }
  };
  faviconsConfig.files.android['manifest.json'].icons = [
    {
      src: 'android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: 'android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ];
  faviconsConfig.icons.appleIcon = {
    'apple-touch-icon.png': { // iPhone Retina
      width: 180,
      height: 180,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-icon-1024x1024.png': { // App store and Schema logo
      width: 1024,
      height: 1024,
      transparent: false,
      rotate: false,
      mask: false
    }
  };
  // Note: Apple recommends not using the startup image as branding but to make the app seem more responsive by using a screenshot
  faviconsConfig.icons.appleStartup = {
    'apple-touch-startup-image-1536x2048.png': { // iPad Air A1475 portrait
      width: 1536,
      height: 2048,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-2048x1536.png': { // iPad Air A1475 landscape
      width: 2048,
      height: 1536,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-1792x828.png': { // iPhone XR landscape
      width: 1792,
      height: 828,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-828x1792.png': { // iPhone XR portrait
      width: 828,
      height: 1792,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-1125x2436.png': { // iPhone X/XS portrait
      width: 1125,
      height: 2436,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-2436x1125.png': { // iPhone X/XS landscape
      width: 2436,
      height: 1125,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-1668x2224.png': { // 10.5 iPad Pro portrait
      width: 1668,
      height: 2224,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-2224x1668.png': { // 10.5 iPad Pro landscape
      width: 2224,
      height: 1668,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-2048x2732.png': { // 12.9 iPad Pro portrait
      width: 2048,
      height: 2732,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-2732x2048.png': { // 12.9 iPad Pro landscape
      width: 2732,
      height: 2048,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-1242x2688.png': { // iPhone XS Max portrait
      width: 1242,
      height: 2688,
      transparent: false,
      rotate: false,
      mask: false
    },
    'apple-touch-startup-image-2688x1242.png': { // iPhone XS Max landscape
      width: 2688,
      height: 1242,
      transparent: false,
      rotate: false,
      mask: false
    }
  };
  faviconsConfig.icons.favicons = {
    'favicon-32x32.png': {
      width: 32,
      height: 32,
      transparent: true,
      rotate: false,
      mask: false
    },
    'favicon-48x48.png': {
      width: 48,
      height: 48,
      transparent: true,
      rotate: false,
      mask: false
    },
    'favicon-96x96.png': {
      width: 96,
      height: 96,
      transparent: true,
      rotate: false,
      mask: false
    }
  };
  faviconsConfig.icons.windows = {
    'mstile-70x70.png': {
      width: 128,
      height: 128,
      transparent: false,
      rotate: false,
      mask: false
    },
    'mstile-150x150.png': {
      width: 270,
      height: 270,
      transparent: false,
      rotate: false,
      mask: false
    },
    'mstile-310x150.png': {
      width: 558,
      height: 270,
      transparent: false,
      rotate: false,
      mask: false
    },
    'mstile-310x310.png': {
      width: 558,
      height: 558,
      transparent: false,
      rotate: false,
      mask: false
    }
  };

  return gulp.src(paths.client.svgIcon)
    .pipe(favicons({
      appName: 'Schoolhouse Yoga',
      appShortName: 'SHY',
      appDescription: 'Discover the best yoga classes and teacher training in Pittsburgh. Squirrel Hill, East Liberty, and Ross Park schools offering Ashtanga, Flow, Prenatal, Mommy and Me, Kundalini, and Gentle Yoga.',
      developerName: 'Nate Stuyvesant',
      path: '', // set icon paths to website base href
      start_url: '/',
      icons: {
        appleIcon: { background: '#5f4884', offset: 5 },
        coast: false, // latest can use the SVG icon
        firefox: false, // latest can use the SVG icon
        appleStartup: { offset: 5 },
        windows: { background: '#5f4884', offset: 7 },
        favicons: true,
        yandex: false
      }
    }))
    .on('error', fancyLog)
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/`));
});

// Shrink images and output cache-busted names
gulp.task('build:images', () =>
  gulp.src(paths.client.images)
    .pipe(plugins.imagemin([
      plugins.imagemin.optipng({ optimizationLevel: 5 }),
      plugins.imagemin.jpegtran({ progressive: true }),
      // plugins.imagemin.gifsicle({ interlaced: true }), // Not using GIFs
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
    `${paths.dist}/${clientPath}/index.html`,
    `${paths.dist}/${clientPath}/leta.html`,
    `${paths.dist}/${clientPath}/assets/data/*.json`
  ], { base: `${paths.dist}/${clientPath}` })
    .pipe(plugins.revRewrite({
      replaceInExtensions: ['.html', '.js', '.json'],
      manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)
    }))
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
);

// Create the build in dist
gulp.task('build',
  gulp.series(
    'clean:dist',
    'inject:scss',
    'transpile:server',
    gulp.parallel('build:images', 'build:icons', 'copy:fonts'),
    gulp.parallel('copy:dist', 'copy:dist:server', 'copy:dist:client', 'webpack:dist'),
    'image:cache-busting'
  )
);

// Run nodemon with debugging (server/config/express.js runs webpack.make.js)
gulp.task('serve',
  gulp.series(
    gulp.parallel('eslint', 'eslint:tests', 'inject:scss', 'copy:fonts', 'env:common'),
    gulp.parallel('start:server', 'start:client'),
    'watch'
  )
);

// Run integration tests using Jest
gulp.task('test:server:jest', done => {
  // Helpful options: --coverage  --detectOpenHandles --runInBand (run test sequentially for debugging)
  shelljs.exec('jest --colors --verbose');
  done();
});

// Run server unit and integration tests
gulp.task('test:server', gulp.series('env:common', 'env:test', 'test:server:jest'));

// Run client unit tests - could build in Jest or skip and use Cypress
// gulp.task('test:client', done => {
// });

// Run all tests
gulp.task('test', gulp.series('eslint:tests', 'test:server'/*, 'test:client'*/)); // temporarily skip client tests

// Run tests created in Jest
gulp.task('jest', gulp.series('env:common', 'test:server:jest'));

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

// Run end-to-end testing using Cypress
// gulp.task('test:e2e', gulp.parallel('webpack:dist', 'env:common', 'env:test', 'start:server', 'webdriver_update'), () => {
// });

// Push build to Heroku via git
gulp.task('deploy', done => {
  shelljs.cd(paths.dist); // Set our working directory

  // If there are no changes, skip commit
  if(shelljs.exec('git status --porcelain', { silent: true }).output === '') {
    console.log('No differences detected. Skipping commit.');
    return done();
  }
  // There were changes, go ahead...
  console.log('Deploying changes to Heroku...');
  shelljs.exec('git add -A . && git commit -m deploy && git push --force heroku master');
  done();
});
