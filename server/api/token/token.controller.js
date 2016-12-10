/**
 * GET     /api/token              ->  index
 */
'use strict';
import braintree from 'braintree';
const config = require('../../config/environment');

// Gets a token from Braintree
export function index(req, res) {
  // Grab Braintree gateway settings from config
  const gateway = braintree.connect(config.gateway);
  // Generate the client token
  gateway.clientToken.generate({}, (err, response) => {
    if(err) throw err; // Usually authentication issues
    res.send(response.clientToken);
  });
}
