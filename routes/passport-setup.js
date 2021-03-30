const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path:path.resolve(
    process.cwd(),
    process.env.HEROKU === "true" ? ".env" : ".env.dev"
  )
});

const HIDDEN_clientID = process.env.HIDDEN_clientID;
const HIDDEN_clientSecret =  process.env.HIDDEN_clientSecret;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    // if you nee DB
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
    done(null, user);
  });

  passport.use(new GoogleStrategy({
      clientID : HIDDEN_clientID,
      clientSecret: HIDDEN_clientSecret,
      //callbackURL : "http://localhost:10040/login/google/callback"
      callbackURL: "https://touch2eat.herokuapp.com/login/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // if you want to add DB use profile.id to match agains db
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return done(err, user);
        // });

        console.log('accessToken : ', accessToken);
        console.log('refreshToken : ', refreshToken);
        console.log('profile : ', profile);
        console.log('done : ', done);


        return done(null, profile);
        
    }
  ));
  
  return passport;
}