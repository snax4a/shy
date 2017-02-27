/* eslint-env node */
// Karma configuration
// Docs: http://karma-runner.github.io/1.0/config/configuration-file.html

import makeWebpackConfig from './webpack.make';

module.exports = function(config) {
  config.set({
    // Disable watching files
    autoWatch: false,

    //basePath: '', // Default commented out

    browsers: ['PhantomJS'], // PhantomJS, Chrome, ChromeCanary, Firefox, Opera, IE, Safari

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
    //singleRun: false, // Commented due to being the default

    webpack: makeWebpackConfig({ TEST: true }),

    webpackMiddleware: {
      noInfo: true
    }
  });
};
