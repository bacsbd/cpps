const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const loginMiddleware = grabMiddleware('login');
const User = require('mongoose').model('User');
const recaptcha = require('express-recaptcha');

const router = express.Router();

router.get('/profile', loginMiddleware, get_profile);
router.get('/profile/change-password', loginMiddleware, recaptcha.middleware.render, get_changePassword);

module.exports = {
  addRouter(app) {
    app.use('/user', router);
  }
};

/**
 *Implementation
 */

function get_profile(req, res) {
  return myRender(req, res, 'user/profile');
}

function get_changePassword(req, res) {
  return myRender(req, res, 'user/changePassword.pug', {
    recaptcha: req.recaptcha
  });
}
