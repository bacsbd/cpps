const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const User = require('mongoose').model('User');
const loginMiddleware = grabMiddleware('login');
const mailer = require('forthright48/mailer').mailer;

const router = express.Router();

router.get('/verify', loginMiddleware, get_verify);
router.post('/verify', loginMiddleware, post_verify);
router.get('/send-code', loginMiddleware, get_send_code);

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
  if (req.session.verified) {
    req.flash('info', 'Email already verified');
    return res.redirect('/');
  }
  const code = req.body.code;

  if (code !== req.session.verificationValue) {
    req.flash('error', 'Wrong verification code');
    return res.redirect('/user/verify');
  }

  User.findOne({
    email: req.session.email
  }).exec(function(err, user) {
    if (err) {
      req.flash('error', 'Some error occured. Try again.');
      return res.redirect('/user/verify');
    }
    user.verified = true;
    user.verificationValue = undefined;
    user.save(function(err) {
      if (err) {
        req.flash('error', 'Some error occured. Try again.');
        return res.redirect('/user/verify');
      }
      req.session.verified = true;
      req.flash('success', 'Verification successful');
      return res.redirect('/');
    });
  });
}

function get_send_code(req, res) {
  if (req.session.verified) {
    req.flash('info', 'Email already verified');
    return res.redirect('/');
  }

  const email = {
    to: [req.session.email],
    from: 'no-reply@forthright48.com',
    subject: 'Verfication Code for CPPS',
    text: `Here is your verification code: "${req.session.verificationValue}"`,
    html: `Here is your verification code: "<b> ${req.session.verificationValue}</b>"`
  };

  mailer.sendMail(email, function(err) {
    if (err) {
      req.flash('error', 'There was some error while sending verification code. Try again.');
    } else {
      req.flash('success', 'Verification Code sent to your email');
    }
    return res.redirect('/user/verify');
  });
}
