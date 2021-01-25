const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const passport = require('passport');
const verifyGoogle = require('../passport/verifyGoogle');
const verifyLocal = require('../passport/verifyLocal');
const verifyRefreshJWT = require('../passport/verifyRefreshJWT');
const verifyAuthJWT = require('../passport/verifyAuthJWT');

const configurePassport = () => {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: new URL('/api/auth/google/callback', process.env.SERVER_ORIGIN).href,
        passReqToCallback: true,
        proxy: true,
      },
      verifyGoogle
    )
  );

  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      verifyLocal
    )
  );

  passport.use('refresh-jwt', new CustomStrategy(verifyRefreshJWT));

  passport.use('auth-jwt', new CustomStrategy(verifyAuthJWT));

  return passport.initialize(undefined);
};

module.exports = configurePassport;
