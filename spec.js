'use strict';
/* eslint-env node */
var testsContext;

require('angular');
require('angular-mocks');
require('./client/components/ui-router/ui-router.mock');

testsContext = require.context('./client', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
