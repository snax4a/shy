'use strict';
/* eslint-env node */
var testsContext;

require('angular');
require('angular-mocks');

testsContext = require.context('./client', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
