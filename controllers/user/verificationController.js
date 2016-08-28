const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const User = require('mongoose').model('User');
const loginMiddleware = grabMiddleware('login');

const router = express.Router();

router.get('/verify', loginMiddleware, get_verify);
router.post('/register', loginMiddleware, post_verify);

module.exports = {
  addRouter(app) {
    app.use('/user', router);
  }
};

/**
 *Implementation
 */
function get_verify(req, res) {
  return myRender(req, res, 'user/verify');
}

function post_verify(req, res) {
  return myRender(req, res, 'user/verify');
}
