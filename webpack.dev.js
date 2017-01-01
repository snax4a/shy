/**
 * Webpack config for development
 */
/* global module, require */
module.exports = require('./webpack.make')({
  BUILD: false,
  TEST: false,
  DEV: true
});
