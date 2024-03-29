import { Router } from 'express';
import passport from 'passport';
import { signToken } from '../auth.service';

const router = Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    let error = err || info;
    if(error) {
      return res.status(401).send(error);
    }
    if(!user) {
      return res.status(404).send({ message: 'Something went wrong, please try again.' });
    }
    const token = signToken(user._id, user.role);
    res.send({ token });
  })(req, res, next);
});

export default router;
