/**
 * Webpack config for builds
 */
/* global module, require */
module.exports = require('./webpack.make')({
  BUILD: true,
  TEST: false,
  DEV: false
});
