import { Router } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import local from './local';
import google from './google';
import config from '../config/environment';
import { authenticateLocal, googleUserFind, createUser } from '../api/user/user.controller';
//import asyncWrapper from '../middleware/async-wrapper'; // only wrap async functions

const router = Router();

// Setup local authentication strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password' // this is the virtual field on the model
}, async(email, password, done) => {
  const authenticatedUser = await authenticateLocal(email, password);
  if(!authenticatedUser) {
    return done(null, false, { message: 'Unrecognized username/password combination.' });
  } else {
    return done(null, authenticatedUser);
  }
}));

router.use('/local', local);

// Setup Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL
}, async(accessToken, refreshToken, profile, done) => {
  let googleUser = await googleUserFind(profile.id);
  if(googleUser) return done(null, googleUser); // user is already setup

  // User does not exist, let's create a new one
  googleUser = {
    email: profile.emails[0].value,
    role: 'student',
    provider: 'google',
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    phone: profile.phone,
    optOut: false,
    google: { id: profile.id }
  };
  const savedUser = await createUser(googleUser);
  if(!savedUser) {
    return done(null, false, { message: 'Problem creating Google-integrated user.' });
  } else {
    return done(null, savedUser);
  }
}));

router.use('/google', google);

export default router;
