const createResponse = require('../utills/createResponse');
const statusCodes = require('../utills/statusCodes');
const { ValidationError, GoogleAuthError } = require('../utills/Errors');
const User = require('../models/User');
const FavoritePokemon = require('../models/FavoritePokemon');
const bcrypt = require('bcrypt');
const createKeyvTokens = require('../utills/createKeyvTokens');
const destroyKeyvTokens = require('../utills/destroyKeyvTokens');
const path = require('path');
const getUA = require('../utills/getUA');

exports.login = async (req, res, next) => {
  try {
    const ua = getUA(req);
    if (!req.user.ua.includes(ua)) {
      req.user.ua.push(ua);
      await req.user.save()
    }
    const tokens = await createKeyvTokens(
      req.jwtk,
      {
        _id: req.user._id.toString(),
        email: req.user.email,
        passwordHash: req.user.passwordHash,
        googleID: req.user.googleID
      },
      ua
    );
    const favoritePokemons = (
      await FavoritePokemon.find({ userID: req.user._id })
    ).map((pokemon) => pokemon.pokemonID);
    return res.status(statusCodes.OK).json(
      createResponse('ok', 'Login successful', {
        user: {
          email: req.user.email,
          favoritePokemons,
          hasPassword: !!req.user.passwordHash
        },
        authJWT: tokens[0],
        refreshJWT: tokens[1]
      })
    );
  } catch (e) {
    return next(e);
  }
};

exports.checkToken = (req, res) => {
  return res
    .status(statusCodes.OK)
    .json(createResponse('ok', 'Token is valid'));
};

exports.signup = async (req, res, next) => {
  const path = 'signup';
  const ua = getUA(req);
  try {
    if (await User.exists({ email: req.body.email })) {
      return next(
        new ValidationError(path, [
          {
            message: `User with email ${req.body.email} already exist`,
            key: 'email'
          }
        ])
      );
    }
    await User.create({
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, 8),
      ua: [ua]
    });
    return res
      .status(statusCodes.CREATED)
      .json(createResponse('created', 'User created'));
  } catch (e) {
    return next(e);
  }
};

exports.google = async (req, res, next) => {
  try {
    if (!req.user._id) {
      return next(new GoogleAuthError());
    }
    const tokens = await createKeyvTokens(
      req.jwtk,
      {
        _id: req.user._id.toString(),
        email: req.user.email,
        googleID: req.user.googleID,
        passwordHash: req.user.passwordHash,
      },
      getUA(req)
    );
    const favoritePokemons = (
      await FavoritePokemon.find({ userID: req.user._id })
    ).map((pokemon) => pokemon.pokemonID);
    const userData = JSON.stringify({
      user: {
        email: req.user.email,
        favoritePokemons,
        hasPassword: !!req.user.passwordHash
      },
      source: 'googleAuth',
      authJWT: tokens[0],
      refreshJWT: tokens[1]
    });
    res.render('authenticated', {
      user: userData
    });
  } catch (e) {
    return next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const favoritePokemons = (
      await FavoritePokemon.find({ userID: req.user._id })
    ).map((pokemon) => pokemon.pokemonID);
    return res.status(statusCodes.OK).json(
      createResponse('ok', 'Login successful', {
        user: {
          email: req.user.email,
          favoritePokemons,
          hasPassword: !!req.user.passwordHash
        }
      })
    );
  } catch (e) {
    return next(e);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    await destroyKeyvTokens(req.jwtk, req.user._id.toString(), getUA(req));
    const [authToken, refreshToken] = await createKeyvTokens(
      req.jwtk,
      {
        _id: req.user._id.toString(),
        email: req.user.email,
        passwordHash: req.user.passwordHash,
        googleID: req.user.googleID
      },
      getUA(req)
    );
    return res.status(statusCodes.OK).json(
      createResponse('ok', 'Token is refreshed', {
        authJWT: authToken,
        refreshJWT: refreshToken
      })
    );
  } catch (e) {
    e.tokenType = 'refresh';
    return next(e);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    if (req.user.passwordHash) {
      if (!req.body.oldPassword) {
        return next(
          new ValidationError('updatePassword', [
            {
              message: 'Old password is required',
              key: 'password'
            }
          ])
        );
      }
      const isValidPassword = await bcrypt.compare(
        req.body.oldPassword,
        req.user.passwordHash
      );
      if (!isValidPassword) {
        return next(
          new ValidationError('updatePassword', [
            {
              message: 'Password is not valid',
              key: 'password'
            }
          ])
        );
      }
    }
    req.user.passwordHash = await bcrypt.hash(req.body.password, 8);
    req.user.save();
    const [authToken, refreshToken] = await createKeyvTokens(
      req.jwtk,
      {
        _id: req.user._id.toString(),
        email: req.user.email,
        passwordHash: req.user.passwordHash,
        googleID: req.user.googleID
      },
      getUA(req)
    );
    return res
      .status(statusCodes.OK)
      .json(createResponse('ok', 'Password updated', {
        authJWT: authToken,
        refreshJWT: refreshToken
      }));
  } catch (e) {
    next(e);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const userAgent = getUA(req)
    await destroyKeyvTokens(req.jwtk, req.user._id.toString(), userAgent);
    await User.updateOne({_id: req.user._id}, {'$pull': {'ua': userAgent}})
    return res
      .status(statusCodes.OK)
      .json(createResponse('ok', 'Logout completed'));
  } catch (e) {
    e.tokenType = 'logout';
    return next(e);
  }
};

exports.logoutAll = async (req, res, next) => {
  try {
    for (let ua of req.user.ua) {
      await destroyKeyvTokens(req.jwtk, req.user._id.toString(), ua);
    }
    req.user.ua = [];
    await req.user.save()
    return res
      .status(statusCodes.OK)
      .json(createResponse('ok', 'Logout from all devices completed'));
  } catch (e) {
    e.tokenType = 'logout';
    return next(e);
  }
};
