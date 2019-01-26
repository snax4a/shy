/* eslint-env node */
// Karma configuration
// Docs: http://karma-runner.github.io/1.0/config/configuration-file.html

// Relevant node modules
// "karma": "^1.6.0",
// "karma-chai-plugins": "^0.9.0",
// "karma-chrome-launcher": "^2.0.0",
// "karma-coverage": "^1.1.1",
// "karma-mocha": "^1.3.0",
// "karma-script-launcher": "^1.0.0",
// "karma-sourcemap-loader": "^0.3.7",
// "karma-spec-reporter": "^0.0.31",
// "karma-webpack": "^2.0.3",

import makeWebpackConfig from './webpack.make';

export default config => {
  config.set({
    // Disable watching files
    autoWatch: false,

    //basePath: '', // Default commented out

    // Switch to headless Chrome once available (replaces PhantomJS)
    browsers: ['ChromeHeadless'], // 'Safari', 'ChromeHeadless', 'ChromeCanary', 'Firefox', 'Opera', 'IE'

    client: {
      mocha: {
        timeout: 5000 // set default mocha spec timeout
      }
    },

    coverageReporter: {
      reporters: [{
        type: 'html', //produces a html document after code is run
        subdir: 'client'
      }, {
        type: 'json',
        subdir: '.',
        file: 'client-coverage.json'
      }],
      dir: 'coverage/' //path to created html doc
    },

    // list of files / patterns to exclude
    //exclude: [], // Default commented out

    // list of files / patterns to load in the browser
    files: ['spec.js'],

    frameworks: ['chai', 'chai-as-promised', 'chai-things', 'mocha', 'sinon-chai'],

    //logLevel: config.LOG_INFO, // LOG_INFO || LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG // Default commented out

    // List: https://www.npmjs.com/browse/keyword/karma-plugin
    //plugins: ['karma-*'], // Default commented out

    // web server port
    port: 9000,

    preprocessors: {
      'spec.js': ['webpack', 'sourcemap'] // added karma-sourcemap-loader today
    },

    // reporter types:
    // - dots
    // - progress (default)
    // - spec (karma-spec-reporter)
    // - junit
    // - growl
    // - coverage
    reporters: ['spec', 'coverage'],

    // Continuous Integration mode - if true, capture browsers, run tests and exit
    //singleRun: false, // Default commented out

    webpack: makeWebpackConfig({ TEST: true }),

    webpackMiddleware: {
      noInfo: true,
      stats: {
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
      }
    }
  });
};
