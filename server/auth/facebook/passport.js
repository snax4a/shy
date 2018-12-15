import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
      'displayName',
      'emails'
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({where: {'facebook.id': profile.id}})
      .then(user => {
        if(user) {
          return done(null, user);
        }

        user = User.build({
          // Implement: pull firstName and lastName out
          name: profile.displayName,
          email: profile.emails[0].value,
          password: config.secrets.session, // prevents errors because password is empty
          role: 'user',
          provider: 'facebook',
          facebook: profile._json
        });
        return user.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
