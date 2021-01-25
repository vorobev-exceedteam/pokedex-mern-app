const express = require('express');

const passport = require('passport');
const authController = require('../controllers/auth');
const passportAuth = require('../middleware/security/passport-auth');
const validationHandler = require('../middleware/validation/validationHandler');
const authSchema = require('../middleware/validation/schemas/authSchema');
const refreshSchema = require("../middleware/validation/schemas/refreshSchema");
const updatePasswordSchema = require("../middleware/validation/schemas/updatePasswordSchema");

const router = express.Router();

router.post(
  '/signup',
  validationHandler(authSchema, 'signup'),
  authController.signup
);

router.get(
  '/checkToken',
  passportAuth('auth-jwt', { session: false }),
  authController.checkToken
);

router.get(
  '/user',
  passportAuth('auth-jwt', { session: false }),
  authController.getUser
);

router.post(
  '/login',
  validationHandler(authSchema, 'login'),
  passportAuth('local', { session: false }),
  authController.login
);

router.post(
  '/refresh',
  validationHandler(refreshSchema, 'refresh'),
  passportAuth('refresh-jwt', { session: false }),
  authController.refresh
);

router.post(
  '/update/password',
  validationHandler(updatePasswordSchema, 'updatePassword'),
  passportAuth('refresh-jwt', { session: false }),
  authController.updatePassword
);

router.delete(
  '/logout',
  passportAuth('refresh-jwt', { session: false }),
  authController.logout
);

router.delete(
  '/logout/all',
  passportAuth('refresh-jwt', { session: false }),
  authController.logoutAll
);

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passportAuth('google', { session: false }),
  authController.google
);

module.exports = router;
