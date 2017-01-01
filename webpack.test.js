/**
 * Webpack config for tests
 */
/* global module, require */
module.exports = require('./webpack.make')({
  BUILD: false,
  TEST: true,
  DEV: false
});
