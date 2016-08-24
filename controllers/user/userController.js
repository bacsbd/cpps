const express = require('express');
const myRender = require('forthright48/world').myRender;
const User = require('mongoose').model('User');

const router = express.Router();

router.get('/login', get_login);
router.post('/login', post_login);

router.get('/test', function(req, res) {
  res.send(JSON.stringify(req.flash('test')));
})

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

function post_login(req, res, next) {
  const email = User.normalizeEmail(req.body.email);
  const password = req.body.password;

  User.findOne({
      email: email
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) {
        req.flash('error', 'Email address not found');
        return res.redirect('/user/login');
      }
      if (user.comparePassword(password)) {
        req.flash('success', 'Successfully logged in');
        return res.redirect('/');
      } else {
        req.flash('error', 'Password did not match');
        return res.redirect('/user/login');
      }
    });
}
