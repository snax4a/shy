import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export function setup(User, config) {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  (accessToken, refreshToken, profile, done) =>
    User.find({where: {'google.id': profile.id}})
      .then(user => {
        // If the user is already setup...
        if(user) {
          return done(null, user);
        }

        // Map Google's properties to our user model
        user = User.build({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          password: config.secrets.session, // prevents errors because password is empty
          email: profile.emails[0].value,
          phone: profile.phone,
          role: 'student',
          username: profile.emails[0].value.split('@')[0],
          provider: 'google',
          optOut: false,
          google: profile._json
        });

        // Return the promise
        return user.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err))
  ));
}
