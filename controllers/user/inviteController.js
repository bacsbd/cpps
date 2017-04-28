/**
  URL Path: /user/invite
*/

const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const User = require('mongoose').model('User');
const userGroup = grabMiddleware('userGroup');
const mailer = require('forthright48/mailer').mailer;

const router = express.Router();

router.get('/', userGroup.isAdmin, get_invite);
router.post('/', userGroup.isAdmin, post_invite);

module.exports = {
  addRouter(app) {
    app.use('/user/invite', router);
  }
};

/**
 *Implementation
 */
function get_invite(req, res) {
  return myRender(req, res, 'user/invite');
}

function post_invite(req, res) {
  const email = User.normalizeEmail(req.body.email);
  const password = User.createHash(req.body.password);

  const user = new User({
    email,
    password,
    verificationValue: User.createSalt()
  });

  user.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        req.flash('error', 'Email address already exists');
      } else {
        req.flash('error', `An error occured. Error code: ${err.code}`);
      }
      return res.redirect('/user/invite');
    }
    req.flash('success', 'Successfully registered');

    //Send activation email
    const email = {
      to: [email],
      from: 'no-reply@nsups.com',
      subject: 'You are invited to join NSUPS Gateway',
      text: `Your password is ${req.body.password}. Please make sure that you change it. Here is your verification code: ${user.verificationValue}`,
      html: `Your password is <b>${req.body.password}</b>. Please make sure that you change it. Here is your verification code: <b>${user.verificationValue}</b>`
    };

    mailer.sendMail(email, function(err) {
      if (err) {
        req.flash('error', 'There was some error while sending verification code. Try again.');
      } else {
        req.flash('success', 'Verification Code sent to your email');
      }
      return res.redirect('/user/invite');
    });
  });
}
