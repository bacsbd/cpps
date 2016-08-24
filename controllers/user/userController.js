const express = require('express');
const myRender = require('forthright48/world').myRender;

const router = express.Router();

router.get('/login', get_login);

module.exports = {
  addRouter(app) {
    app.use('/user', router);
  }
};

/**
 *Implementation
 */
function get_login(req, res) {
  return myRender(req, res, 'user/login');
}
