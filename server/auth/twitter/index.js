'use strict';
const router = require('express').Router();
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }))
  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

export default router;
