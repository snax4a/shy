/* eslint no-process-env:0 no-process-exit:0 */
import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import opn from 'open';
// import path from 'path';
import dotenv from 'dotenv';
import shelljs from 'shelljs';
import webpack from 'webpack';
import { stream as favicons, config as faviconsConfig } from 'favicons';
import sharp from 'sharp';
import flog from 'fancy-log';
import makeWebpackConfig from './webpack.make';

let plugins = gulpLoadPlugins();
let config;

// Defined paths
const clientPath = 'client';
const serverPath = 'server';
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/!(logo*)`, // Don't cache-bust logo
    videos: `${clientPath}/assets/videos/*.mp4`,
    svgIcon: `${clientPath}/assets/images/logo.svg`,
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
  console.log('DEBUG task: ', task);
  let spawn = require('child_process').spawn;
  spawn('node', [
    '--inspect-brk',
    '--trace-deprecation',
    '--trace-warnings',
    'node_modules/gulp/bin/gulp.js',
    // path.join(__dirname, 'node_modules/gulp/bin/gulp.js'), // avoid __dirname and path.join for gulp globs
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
gulp.task('env:common', cb => {
  const result = dotenv.config();
  if (result.error) {
    cb(new Error('There was a problem reading the .env file.'));
  }
  cb();
});

// Change NODE_ENV to 'test'
gulp.task('env:test', done => {
  process.env.NODE_ENV = 'test';
  done();
});

// Add imports of all SCSS files to bottom of client/app/app.scss and return stream
gulp.task('client:inject:scss', () =>
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
gulp.task('webpack', done => {
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
gulp.task('dist:server:transpile', () =>
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
gulp.task('dist:reset', () => del([`${paths.dist}/!(.git*|Procfile)**`], { dot: true }));

// Files to copy to dist/client without processing
gulp.task('dist:client', () =>
  gulp.src([
    `${clientPath}/sitemap.xml`,
    `${clientPath}/manifest.json`,
    `${clientPath}/browserconfig.xml`,
    `${clientPath}/leta.html`,
    `${clientPath}/test.html`,
    `${clientPath}/robots.txt`,
    `${clientPath}/.well-known/*`,
    paths.client.assets,
    `!${paths.client.images}`,
    paths.client.svgIcon,
  ], { dot: true, base: `${clientPath}/` })
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
);

// Copy FontAwesome woff2 and woff fonts to dist/assets/fonts
gulp.task('dist:client:assets:fonts', () =>
  gulp.src([
    'node_modules/@fortawesome/fontawesome-free/webfonts/*.woff*'
  ])
    .pipe(gulp.dest(`${clientPath}/assets/fonts`))
);

// Currently, copy only the SHY video
gulp.task('dist:client:assets:videos', () =>
  gulp.src(paths.client.videos)
    .pipe(gulp.dest(`${clientPath}/assets/videos`))
);

// Files to copy to dist without processing
gulp.task('dist:root', () =>
  gulp.src([
    'package*.json', // package.json and package-lock.json
  ], { cwdbase: true })
    .pipe(gulp.dest(paths.dist))
);

// Files to copy to dist/server without processing
gulp.task('dist:server', () =>
  gulp.src([
    paths.server.esm
  ], { cwdbase: true })
    .pipe(gulp.dest(paths.dist))
);

async function render(renderConfig) {
  const { width } = renderConfig; // required properties

  if(!width) throw new Error('Gulp error in \'dist:client:assets:images:icons\': Width is a required parameter.');

  let { height, name, scale, background } = renderConfig; // optional properties

  scale = scale || 100;
  height = height || width; // assume a square if height not provided
  // If name provided, assume dist/client, else dist/client/assets/images
  name = name ? `./${paths.dist}/${clientPath}/${name}` : `./${paths.dist}/${clientPath}/assets/images/logo-${width}x${height}.png`;

  // Calculate width & height of scaled square logo (rounded)
  const smallerLength = Math.min(width, height);
  const logoLength = Math.round(smallerLength * scale / 100);

  // Calculate padding to center scaled logo within width x height box
  const top = Math.floor((height - logoLength) / 2); // if fractional, smaller padding at the top
  const bottom = Math.ceil((height - logoLength) / 2);
  const left = Math.floor((width - logoLength) / 2); // if fractional, smaller padding on left
  const right = Math.ceil((width - logoLength) / 2);

  const image = sharp(paths.client.svgIcon);
  image
    .resize(logoLength)
    .extend({
      top,
      bottom,
      left,
      right,
      background: background ? background : { r: 0, g: 0, b: 0, alpha: 0 }
    });

  if(background) image.flatten({ background });

  return await image.toFile(name);
}

async function generateIcons() {
  const themeBackground = { background: '#5f4884' }; // Lavender when a background is needed
  const android = { }; // Android devices use the defaults
  const iOS = { ...themeBackground, scale: 95 };
  const edge = { ...themeBackground, scale: 70 };
  const startup = { background: '#fff', scale: 75 };
  const schema = { background: '#fff' };

  return await Promise.all([
    render({ width: 128, ...edge }), // Edge 70x70
    render({ width: 180, name: 'apple-touch-icon.png', ...iOS }), // iOS
    render({ width: 192, ...android }), // Android
    render({ width: 270, ...edge }), // Edge 150x150
    render({ width: 512, ...android }), // Android
    render({ width: 558, height: 270, ...edge }), // Edge 310x150
    render({ width: 558, ...edge }), // Edge 310x310
    render({ width: 1024, ...schema }), // Schema.org logo
    render({ width: 1536, height: 2048, ...startup }), // iOS startup logo - iPad Air A1475 portrait
    render({ width: 2048, height: 1536, ...startup }), // iOS startup logo - iPad Air A1475 portrait
    render({ width: 828, height: 1792, ...startup }), // iOS startup logo - iPhone XR portrait
    render({ width: 1792, height: 828, ...startup }), // iOS startup logo - iPhone XR landscape
    render({ width: 1125, height: 2436, ...startup }), // iOS startup logo - iPhone X/XS portrait
    render({ width: 2436, height: 1125, ...startup }), // iOS startup logo - iPhone X/XS landscape
    render({ width: 1668, height: 2224, ...startup }), // iOS startup logo - 10.5 iPad Pro portrait
    render({ width: 2224, height: 1668, ...startup }), // iOS startup logo - 10.5 iPad Pro landscape
    render({ width: 2048, height: 2732, ...startup }), // iOS startup logo - 12.9 iPad Pro portrait
    render({ width: 2732, height: 2048, ...startup }), // iOS startup logo - 12.9 iPad Pro landscape
    render({ width: 1242, height: 2688, ...startup }), // iOS startup logo - iPhone XS Max portrait
    render({ width: 2688, height: 1242, ...startup }) // iOS startup logo - iPhone XS Max landscape
  ]);
}

// dist/client/assets/images must exist first as sharp won't create directories
gulp.task('dist:client:assets:images:icons', generateIcons);

// Generate icons from an SVG (could use sharp instead)
gulp.task('dist:client:favicons', () => {
  faviconsConfig.icons.favicons = {
    'favicon.ico': { // Old browsers
      sizes: [
        { width: 16, height: 16 },
        { width: 24, height: 24 },
        { width: 32, height: 32 },
        { width: 48, height: 48 },
        { width: 64, height: 64 }
      ]
    }
  };

  return gulp.src(paths.client.svgIcon)
    .pipe(favicons({
      path: '', // set icon paths to website base href
      start_url: '/',
      icons: {
        android: false,
        appleIcon: false,
        coast: false, // latest can use the SVG icon
        firefox: false, // latest can use the SVG icon
        appleStartup: false,
        windows: false,
        favicons: true,
        yandex: false
      }
    }))
    .on('error', flog)
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/`));
});

// Shrink images and output cache-busted names
gulp.task('dist:client:assets:images', () =>
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
gulp.task('dist:client:image:cache-busting', () =>
  gulp.src([
    `${paths.dist}/${clientPath}/app.*.js`,
    `${paths.dist}/${clientPath}/index.html`,
    `${paths.dist}/${clientPath}/leta.html`,
    `${paths.dist}/${clientPath}/test.html`,
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
    'dist:reset',
    'client:inject:scss',
    'dist:server:transpile',
    gulp.parallel('dist:client:assets:images', 'dist:client:favicons', 'dist:client:assets:fonts', 'dist:client:assets:videos'),
    gulp.parallel('dist:root', 'dist:server', 'dist:client', 'webpack'),
    'dist:client:image:cache-busting',
    'dist:client:assets:images:icons'
  )
);

// Run nodemon with debugging (server/config/express.js runs webpack.make.js)
gulp.task('serve',
  gulp.series(
    gulp.parallel('eslint', 'eslint:tests', 'client:inject:scss', 'dist:client:assets:fonts', 'env:common'),
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
// gulp.task('test:e2e', gulp.parallel('webpack', 'env:common', 'env:test', 'start:server', 'webdriver_update'), () => {
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
