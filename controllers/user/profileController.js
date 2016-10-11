const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const loginMiddleware = grabMiddleware('login');
const User = require('mongoose').model('User');
const recaptcha = require('express-recaptcha');

const profileRouter = express.Router(); // '/user/profile'

profileRouter.get('/', get_profile);
profileRouter.get('/change-password', recaptcha.middleware.render, get_changePassword);
profileRouter.post('/change-password', recaptcha.middleware.verify, post_changePassword);

module.exports = {
  addRouter(app) {
    app.use('/user/profile', loginMiddleware, profileRouter);
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

function post_changePassword(req, res) {
  if (req.recaptcha.error) {
    req.flash('error', 'Please complete the captcha');
    return res.redirect('/user/profile/change-password');
  }

  const {
    current,
    newpass,
    repeat
  } = req.body;

  if (newpass !== repeat) {
    req.flash('error', 'New password does not match with retyped password');
    return res.redirect('/user/profile/change-password');
  }

  //Check from db
}
