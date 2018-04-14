const express = require('express');
const User = require('mongoose').model('User');
const {login} = require('middlewares/login');
const mailer = require('mailer').mailer;

const router = express.Router();

router.get('/verify', login, get_verify);
router.post('/verify', login, post_verify);
router.get('/send-code', login, get_send_code);

module.exports = {
  addRouter(app) {
    app.use('/user', router);
  },
  sendEmailVerification,
};

/**
 *Implementation
 */
function get_verify(req, res) {
  return res.render('user/verify.pug');
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

async function sendEmailVerification(emailAddress, verificationValue) {
  const email = {
    to: [emailAddress],
    from: 'CPPS BACS <no-reply@bacsbd.org>',
    subject: 'Verfication Code for CPPS',
    text: `Here is your verification code: ${verificationValue}`,
    html: `Here is your verification code: <b>${verificationValue}</b>`,
  };
  return mailer.sendMail(email);
}

async function get_send_code(req, res) {
  if (req.session.verified) {
    req.flash('info', 'Email already verified');
    return res.redirect('/');
  }

  try {
    await sendEmailVerification(req.session.email, req.session.verificationValue);
    req.flash('success', 'Verification Code sent to your email');
  } catch (err) {
    console.log(err);
    req.flash('error', 'There was some error while sending verification code. Try again.');
  } finally {
    return res.redirect('/user/verify');
  }
}
