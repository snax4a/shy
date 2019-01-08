import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import db from '../utils/db';
import asyncWrapper from '../middleware/async-wrapper';

let validateJwt = expressJwt({
  secret: config.secrets.session
});

// Attaches user object to request if authenticated; otherwise, returns 403
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = `Bearer ${req.query.access_token}`;
      }
      // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
      if(req.query && typeof req.headers.authorization === 'undefined' && req.cookies) {
        req.headers.authorization = `Bearer ${req.cookies.token}`;
      }
      validateJwt(req, res, next);
    })
    // Find user
    .use(asyncWrapper(async(req, res, next) => {
      const sql = 'SELECT _id, role, provider, google FROM "Users" WHERE _id = $1;';
      const { rows } = await db.query(sql, [req.user._id]);
      if(rows.length === 0) return res.status(401).end(); // No user found
      req.user = rows[0]; // Attach user to request
      return next();
    }));
}

// Checks if the user role meets the minimum requirements of the route
export function hasRole(roleRequired) {
  if(!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        return next();
      } else {
        return res.status(403).send('Forbidden');
      }
    });
}

// Returns a jwt token signed by the app secret
export function signToken(id, role) {
  return jwt.sign({ _id: id, role }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}


// Set token cookie directly for oAuth strategies
export function setTokenCookie(req, res) {
  if(!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  let token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);

  // Problem: redirect to correct location would be better handled client-side (but Google Oauth does redirect)
  switch (req.user.role) {
  case 'admin':
    return res.redirect('/admin');
  case 'teacher':
    return res.redirect('/shynet');
  default:
    return res.redirect('/');
  }
}
