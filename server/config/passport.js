const keys = require('../../keys.js');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const user = require('../db/user.controller.js');

/****************** PASSPORT CONFIG ***************/
passport.use(new FacebookStrategy({
  clientID: keys.facebook.FACEBOOK_APP_ID,
  clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: [
    'id', 
    'name', 
    'picture.type(large)', 
    'email', 
    'gender'
  ]
},
(accessToken, refreshToken, profile, cb) =>
user.findOrCreateUser(profile,
  (err, user) => err ?
    cb(err)
    : cb(null, {
        _facebookUniqueID: user._facebookUniqueID,
        firstname: user.firstname,
        lastname: user.lastname,
        picture: user.picture
    })
  ))
);
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

module.exports = passport;
