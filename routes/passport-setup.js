const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
      clientID : '682038719555-kf6bmesfs3n58n4f0ne3violb5802g52.apps.googleusercontent.com',
      clientSecret: 'PzMMEHGWD9_3yVGxk0LIKg5O',
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