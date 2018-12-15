'use strict';

import braintree from 'braintree';
import config from '../../config/environment';

// Gets a token from Braintree
export async function index(req, res) {
  const gateway = braintree.connect(config.gateway); // synchronous call

  // Generate the client token
  const { clientToken } = await gateway.clientToken.generate({});
  res.status(200).send(clientToken);
}
