'use strict';
const router = require('express').Router();
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

router
  .get('/', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signup',
    session: false
  }))
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

export default router;
