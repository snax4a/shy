'use strict';
const router = require('express').Router();
import passport from 'passport';
import { signToken } from '../auth.service';

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    let error = err || info;
    if(error) {
      return res.status(401).json(error);
    }
    if(!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    let token = signToken(user._id, user.role);
    res.json({ token });
  })(req, res, next);
});

export default router;
