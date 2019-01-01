/* eslint no-process-env:0 */
// This CJS file exists to load Babel during dev/test; app.js is the Express app.

// Set default node environment to development
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
  // Register the Babel require hook
  require('@babel/register');
}

// Export the application
exports = module.exports = require('./app');
