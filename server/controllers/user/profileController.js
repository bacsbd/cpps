const express = require('express');
const loginMiddleware = require('middlewares/login');
const User = require('mongoose').model('User');
const recaptcha = require('express-recaptcha');
const rootPath = require('world').rootPath;
const path = require('path');
const ojnames = require(path.join(rootPath, 'models', 'ojnames.js'));
const _ = require('lodash');
const ojscraper = require('ojscraper');

const router = express.Router(); // '/user/profile'

router.get('/', getProfile);
router
  .get('/change-password', recaptcha.middleware.render, getChangePassword);
router
  .post('/change-password', recaptcha.middleware.verify, postChangePassword);
router.get('/set-username', getSetUsername);
router.post('/set-username', postSetUsername);
router.post('/set-userId', postSetUserId);
router.post('/sync-ojsolve/:ojname', postSyncOjname);


module.exports = {
  addRouter(app) {
    app.use('/user/profile', loginMiddleware, router);
  },
};

/**
 *Implementation
 */

async function getProfile(req, res) {
  const username = req.session.username;
  const user = await User.findOne({username});
  const data = {};
  _.forEach(ojnames.data, function(oj) {
    data[oj.name] = oj;
  });
  _.forEach(user.ojStats, function(userId) {
    data[userId.ojname].userId = userId.userIds;
    data[userId.ojname].solveCount = userId.solveCount;
  });
  let dataSorted = [];
  _.forEach(data, function(x) {
    dataSorted.push(x);
  });
  dataSorted = _.orderBy(data, ['name']);
  return res.render('user/profile', {data: dataSorted});
}

function getChangePassword(req, res) {
  return res.render('user/changePassword.pug', {
    recaptcha: req.recaptcha,
  });
}

function postChangePassword(req, res, next) {
  if (req.recaptcha.error) {
    req.flash('error', 'Please complete the captcha');
    return res.redirect('/user/profile/change-password');
  }

  const {
    current,
    newpass,
    repeat,
  } = req.body;

  if (newpass !== repeat) {
    req.flash('error', 'New password does not match with retyped password');
    return res.redirect('/user/profile/change-password');
  }

  const email = req.session.email;

  User.findOne({
      email,
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(err); // ULK
      if (!user.comparePassword(current)) {
        req.flash('error', 'Wrong password');
        return res.redirect('/user/profile/change-password');
      }
      user.password = User.createHash(newpass);
      user.save(function(err) {
        if (err) return next(err);
        req.flash('success', 'Password successfully changed');
        return res.redirect('/user/profile');
      });
    });
}

function getSetUsername(req, res) {
  if ( req.session.username ) return res.redirect('/user/profile');
  return res.render('user/setUsername');
}

function postSetUsername(req, res) {
  if ( req.session.username ) return res.redirect('/user/profile');

  const username = req.body.username;

  // TODO: Validate username
  if ( !username ) {
    req.flash('error', 'Invalid Username');
    return res.redirect('/user/profile/set-username');
  }

  const email = req.session.email;

  User
    .findOne({email})
    .exec()
    .then(function(user) {
      user.username = username;
      return user.save();
    }).then(function() {
      req.flash('success', 'Username successfully set');
      req.session.username = username;
      return res.redirect('/user/profile/set-username');
    }, function(err) {
      if ( err.code == 11000 ) {
        req.flash('error', 'Username already exists');
      } else {
        console.log(err);
        req.flash('error', 'Some error occured');
      }
      return res.redirect('/user/profile/set-username');
    });
}

async function postSetUserId(req, res, next) {
  // TODO: Validate OJ Name
  const {ojname, userId} = req.body;
  const username = req.session.username;
  try {
    const user = await User.findOne(
      {username, 'ojStats.ojname': {$ne: ojname}}).exec();
    if (!user) {
      const e = new Error('OJ Id already set');
      e.name = 'OJEXIST';
      throw e;
    }
    user.ojStats.push({ojname, userIds: [userId]});
    await user.save();
    req.flash('success', `User Id successfully set for ${ojname}`);
    return res.redirect('/user/profile');
  } catch (err) {
    if ( err.name === 'OJEXIST' ) {
      req.flash('error', err.message);
      return res.redirect('/user/profile');
    }
    return next(err);
  }
}

async function postSyncOjname(req, res, next) {
  const ojname = req.params.ojname;
  try {
    const user = await User.findById(req.session.userId);

    const ojStat = _.filter(user.ojStats, function(x) {
      return x.ojname === ojname;
    })[0];

    const ojUserId = ojStat.userIds[0];
    const scrap = await ojscraper.getUserInfo({ojname, username: ojUserId});

    if ( ojStat.solveCount && ojStat.solveCount >= scrap.solveCount ) {
      req.flash('info', 'Already uptodate');
      return res.redirect('/user/profile');
    }

    ojStat.solveCount = parseInt(scrap.solveCount);
    ojStat.solveList = scrap.solveList;

    await user.save();

    req.flash('success', 'Solve Stats Updated');
    return res.redirect('/user/profile');
  } catch(err) {
    next(err);
  }
}
