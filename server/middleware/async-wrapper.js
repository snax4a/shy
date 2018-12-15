// Middleware enabling async functions to use Express default error-handling

'use strict';

module.exports = middleware => async(req, res, next) => {
  try {
    await middleware(req, res, next);
  } catch(err) {
    return next(err);
  }
};
