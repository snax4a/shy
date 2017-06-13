import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localAuthenticate(User, email, password, done) {
  return User.find({
    where: {
      email: email.toLowerCase()
    }
  })
    .then(user => {
      if(!user) {
        return done(null, false, {
          message: 'Unrecognized username / password combination.'
        });
      }

      return user.authenticate(password, (authError, authenticated) => {
        if(authError) {
          return done(authError);
        }
        if(!authenticated) {
          return done(null, false, { message: 'This password is not correct.' });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, (email, password, done) => {
    if(!password) password = config.secrets.session; // prevents errors because password is empty
    return localAuthenticate(User, email, password, done);
  }));
}
