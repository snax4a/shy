import { Router } from 'express';
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

const router = Router();

router
  .get('/', passport.authenticate('google', {
    failureRedirect: '/signup',
    scope: [
      'profile',
      'email'
    ],
    session: false
  }))
  .get('/callback', passport.authenticate('google', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

export default router;
