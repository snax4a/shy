import passport from 'passport';
import {Strategy as TwitterStrategy} from 'passport-twitter';

export function setup(User, config) {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    profile._json.id = `${profile._json.id}`;
    profile.id = `${profile.id}`;

    return User.find({where: {'twitter.id': profile.id}})
      .then(user => {
        if(user) {
          return done(null, user);
        }

        user = User.build({
          // Implement: pull out first and last names
          name: profile.displayName,
          username: profile.username,
          password: config.secrets.session, // prevents errors because password is empty
          role: 'user',
          provider: 'twitter',
          twitter: profile._json
        });
        return user.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
