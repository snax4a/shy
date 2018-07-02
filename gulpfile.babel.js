/* eslint no-process-env:0 no-process-exit:0 */
/* global console, setInterval, clearInterval, require, process, __dirname */
'use strict';

import del from 'del'
import grunt from 'grunt'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import http from 'http'
import lazypipe from 'lazypipe'
import nodemon from 'nodemon'
import open from 'open' // Not a recommended npm package due to security issue but only used during development
import path from 'path'
import { Server as KarmaServer } from 'karma'
import { protractor, webdriver_update } from 'gulp-protractor'
import { Instrumenter } from 'isparta'
import union from 'lodash/union'
import webpack from 'webpack'
import makeWebpackConfig from './webpack.make'

let plugins = gulpLoadPlugins()
let config

const clientPath = 'client'
const serverPath = 'server'
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [`${clientPath}/**/!(*.spec|*.mock).js`],
    styles: [`${clientPath}/{app,components}/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/{app,components}/**/*.pug`,
    mainView: `${clientPath}/index.html`,
    test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js']
  },
  server: {
    scripts: [
      `${serverPath}/**/!(*.spec|*.integration).js`,
      `!${serverPath}/config/local.env.sample.js`
    ],
    json: [`${serverPath}/**/*.json`],
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
    }
  },
  karma: 'karma.conf.js',
  dist: 'dist'
}

// Helper functions

// Log to console
function onServerLog(log) {
  console.log(plugins.util.colors.white('[')
    + plugins.util.colors.yellow('nodemon')
    + plugins.util.colors.white('] ')
    + log.message)
}

// Perform HTTP GET to check for app readiness
function checkAppReady(cb) {
  let options = {
    host: 'localhost',
    port: config.port
  }
  http.get(options, () => cb(true))
    .on('error', () => cb(false))
}

// Check every 100ms until app server is ready
function whenServerReady(cb) {
  let serverReady = false
  let appReadyInterval = setInterval(() =>
    checkAppReady(ready => {
      if(!ready || serverReady) {
        return
      }
      clearInterval(appReadyInterval)
      serverReady = true
      cb()
    }),
  100)
}

// Reusable pipelines

const lintClientScripts = lazypipe()
  .pipe(plugins.eslint, `${clientPath}/.eslintrc`)
  .pipe(plugins.eslint.format)

const lintClientTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${clientPath}/.eslintrc`,
    envs: [
      'browser',
      'es6',
      'mocha'
    ]
  })
  .pipe(plugins.eslint.format)

const lintServerScripts = lazypipe()
  .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
  .pipe(plugins.eslint.format)

const lintServerTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${serverPath}/.eslintrc`,
    envs: [
      'node',
      'es6',
      'mocha'
    ]
  })
  .pipe(plugins.eslint.format)

// Use gulp-babel to process ES6 for nodeJS server, gets babelrc from package.json
const transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel)
  .pipe(plugins.sourcemaps.write, '.')

const mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 15000,
    require: ['./mocha.conf']
  })

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
  })

// Environmental Tasks

gulp.task('env:all', done => {
  let vars;
  try {
    vars = require(`./${serverPath}/config/local.env`);
  } catch(e) {
    vars = {}
  }
  plugins.env({
    vars
  })
  done()
})

gulp.task('env:test', done => {
  plugins.env({
    vars: { NODE_ENV: 'test' }
  })
  done()
})

gulp.task('env:prod', done => {
  plugins.env({
    vars: { NODE_ENV: 'production' }
  })
  done()
})

// Primary Tasks

// Add imports of all SCSS files to bottom of client/app/app.scss and return stream
gulp.task('inject:scss', () =>
  gulp.src(paths.client.mainStyle)
    .pipe(plugins.inject(
      gulp.src(union(paths.client.styles, [`!${paths.client.mainStyle}`]), { read: false })
        .pipe(plugins.sort()), {
        transform: filepath => {
          let newPath = filepath
            .replace(`/${clientPath}/app/`, '')
            .replace(`/${clientPath}/components/`, '../components/')
            .replace(/_(.*).scss/, (match, p1/*, offset, string*/) => p1)
            .replace('.scss', '')
          return `@import '${newPath}';`;
        }
      }))
    .pipe(gulp.dest(`${clientPath}/app`))
)

// Generate webpack config based on environment
function webpackCompile(options, cb) {
  let compiler = webpack(makeWebpackConfig(options));

  compiler.run((err, stats) => {
    if(err) return cb(err)
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
    }))
    cb()
  })
}

gulp.task('webpack:dev', cb => webpackCompile({ DEV: true }, cb))
gulp.task('webpack:dist', cb => webpackCompile({ BUILD: true }, cb))
gulp.task('webpack:test', cb => webpackCompile({ TEST: true }, cb))

// Minimal transpiliation since we're using nodeJS > 7 (mainly imports)
gulp.task('transpile:server', () =>
  gulp.src(union(paths.server.scripts, paths.server.json))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`))
)

gulp.task('lint:scripts:client', () =>
  gulp.src(union(
    paths.client.scripts,
    paths.client.test.map(blob => `!${blob}`)
  ))
    .pipe(lintClientScripts())
)

gulp.task('lint:scripts:server', () =>
  gulp.src(union(
    paths.server.scripts,
    paths.server.test.integration.map(blob => `!${blob}`),
    paths.server.test.unit.map(blob => `!${blob}`)
  ))
    .pipe(lintServerScripts())
)

gulp.task('lint:scripts', done => {
  gulp.parallel('lint:scripts:client', 'lint:scripts:server')
  done()
})

// In case we ever need to lint our tests...
// gulp.task('lint:scripts:clientTest', () =>
//   gulp.src(paths.client.test)
//     .pipe(lintClientTestScripts())
// )

// gulp.task('lint:scripts:serverTest', () =>
//   gulp.src(paths.server.test)
//     .pipe(lintServerTestScripts())
// )

gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }))

gulp.task('start:client', done => {
  whenServerReady(() => {
    open(`http://localhost:${config.browserSyncPort}`);
    done();
  })
})

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${serverPath}/config/environment`)
  nodemon(`--trace-deprecation --trace-warnings -w ${serverPath} ${serverPath}`)
    .on('log', onServerLog)
})

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  config = require(`./${paths.dist}/${serverPath}/config/environment`)
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog)
})

gulp.task('start:server:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${serverPath}/config/environment`)
  nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`)
    .on('log', onServerLog)
})

gulp.task('watch', () => {
  const testFiles = union(paths.client.test, paths.server.test.unit, paths.server.test.integration)

  plugins.watch(union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts())

  plugins.watch(union(paths.server.test.unit, paths.server.test.integration))
    .pipe(plugins.plumber())
    .pipe(lintServerTestScripts())
})

gulp.task('copy:fonts:dev', () =>
  gulp.src(['node_modules/bootstrap-sass/assets/fonts/bootstrap/*', 'node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest(`${clientPath}/assets/fonts`))
)

gulp.task('serve',
  gulp.series(
    gulp.parallel('clean:tmp', 'lint:scripts', 'inject:scss', 'copy:fonts:dev', 'env:all'),
    // 'webpack:dev', // why is this needed?
    gulp.parallel('start:server', 'start:client'),
    'watch'
  )
)

gulp.task('serve:debug',
  gulp.series(
    gulp.parallel('clean:tmp', 'lint:scripts', 'inject:scss', 'copy:fonts:dev', 'env:all'), 
    'webpack:dev',
    gulp.parallel('start:server:debug', 'start:client'),
    'watch'
  )
)

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}))

gulp.task('copy:npm-lock', () =>
  gulp.src(['package-lock.json'], { dot: true })
    .pipe(gulp.dest(`${paths.dist}`))
)

gulp.task('copy:extras', () =>
  gulp.src([
    `${clientPath}/favicon.png`,
    `${clientPath}/favicon.ico`,
    `${clientPath}/sitemap.xml`,
    `${clientPath}/apple-touch-icon.png`,
    `${clientPath}/apple-touch-icon-120.png`,
    `${clientPath}/newsletter.html`,
    `${clientPath}/leta.html`,
    `${clientPath}/robots.txt`,
    `${clientPath}/.htaccess`,
    `${clientPath}/apple-developer-merchantid-domain-association`,
  ], { dot: true })
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
)

// Copy everything except images (leave that to Webpack)
gulp.task('copy:assets', () =>
  gulp.src([paths.client.assets, `!${paths.client.images}`])
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
)

gulp.task('copy:fonts:dist', () =>
  gulp.src(['node_modules/bootstrap-sass/assets/fonts/bootstrap/*', 'node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`))
)

gulp.task('copy:server', () =>
  gulp.src(['package.json'], { cwdbase: true })
    .pipe(gulp.dest(paths.dist))
)

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
)

gulp.task('revReplaceWebpack', () =>
  // Use cache-busting URLs for images in JS code and newsletter
  gulp.src(['dist/client/app.*.js', 'dist/client/newsletter.html', 'dist/client/leta.html'])
    .pipe(plugins.revReplace({manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)}))
    .pipe(gulp.dest('dist/client'))
)

gulp.task('revReplaceJson', () =>
  // Use cache-busting URLs for images in JSON assets
  gulp.src(['dist/client/assets/data/*.json'])
    .pipe(plugins.revReplace({replaceInExtensions: ['.json'], manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)}))
    .pipe(gulp.dest('dist/client/assets/data'))
)

gulp.task('build',
  gulp.series(
    gulp.parallel('clean:dist', 'clean:tmp'),
    'inject:scss',
    'transpile:server',
    'build:images',
    gulp.parallel('copy:npm-lock', 'copy:extras', 'copy:assets', 'copy:fonts:dist', 'copy:server', 'webpack:dist'),
    'revReplaceWebpack',
    'revReplaceJson'
  )
)

gulp.task('serve:dist',
  gulp.series(
    'build', 'env:all', 'env:prod',
    gulp.parallel('start:server:prod', 'start:client')
  )
)

gulp.task('mocha:unit', () =>
  gulp.src(paths.server.test.unit)
    .pipe(mocha())
)

gulp.task('mocha:integration', () =>
  gulp.src(paths.server.test.integration)
    .pipe(mocha())
)

gulp.task('test:server', gulp.series('env:all', 'env:test', 'mocha:unit', 'mocha:integration'))

gulp.task('test:client', done => {
  new KarmaServer({
    configFile: `${__dirname}/${paths.karma}`,
    singleRun: true
  }, exitCode => {
    console.log(`Karma Server exited with code: ${exitCode}`)
    done(exitCode)
    process.exit(exitCode)
  }).start()
})

gulp.task('test', gulp.series('test:server', 'test:client'))

// Run all unit tests in debug mode
gulp.task('test-debug', () => {
  let spawn = require('child_process').spawn
  spawn('node', [
    '--debug-brk',
    path.join(__dirname, 'node_modules/gulp/bin/gulp.js'),
    'test'
  ], { stdio: 'inherit' })
})

gulp.task('coverage:pre', () =>
  gulp.src(paths.server.scripts)
    // Covering files
    .pipe(plugins.istanbul({
      instrumenter: Instrumenter, // Use the isparta instrumenter for ES6 code coverage
      includeUntested: true
    }))
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire())
)

gulp.task('coverage:unit', done => {
  gulp.src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul())
  done()
})

gulp.task('coverage:integration', done => {
  gulp.src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul())
    done()
})

gulp.task('test:server:coverage', gulp.series('coverage:pre', 'env:all', 'env:test', 'coverage:unit', 'coverage:integration'))

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// gulp.task('test:e2e', ['webpack:test', 'env:all', 'env:test', 'start:server', 'webdriver_update'], () => {
gulp.task('test:e2e', gulp.parallel('webpack:dist', 'env:all', 'env:test', 'start:server', 'webdriver_update'), () => {
  gulp.src(paths.client.e2e)
    .pipe(protractor({
      configFile: 'protractor.conf.js',
    }))
    .on('error', e => {
      throw e
    })
    .on('end', () => {
      process.exit()
    })
})

// Equivalent of grunt file. Replace with Gulp tasks or npm in future.
grunt.initConfig({
  buildcontrol: {
    options: {
      dir: paths.dist,
      commit: true,
      push: true,
      connectCommits: false,
      message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
    },
    heroku: {
      options: {
        remote: 'heroku',
        branch: 'master'
      }
    }
  }
})

// Using to deploy builds to Heroku
grunt.loadNpmTasks('grunt-build-control')

gulp.task('deploy', done => {
  grunt.tasks(
    ['buildcontrol:heroku'], // grunt task(s) to perform
    { gruntfile: false }, // use grunt.initConfig instead of Gruntfile
    () => {
      done();
    }
  )
})

// Commands being executed by node_modules/grunt-build-control/tasks/build_control.js
// cd paths.dist
// git fetch --update-head-ok --progress --verbose heroku master
// git symbolic-ref HEAD refs/heads/master
// git reset
// IF there are changes...
//  git add -A .
//  git commit --file=commitFile-fecc28
//  git push heroku master
// Why not turn these into an npm script? Not even platform-specific.
