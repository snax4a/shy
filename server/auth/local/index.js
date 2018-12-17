'use strict';
const router = require('express').Router();
import passport from 'passport';
import { signToken } from '../auth.service';

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    let error = err || info;
    if(error) {
      return res.status(401).send(error);
    }
    if(!user) {
      return res.status(404).send({message: 'Something went wrong, please try again.'});
    }
    let token = signToken(user._id, user.role);
    return res.send({ token });
  })(req, res, next);
});

export default router;
