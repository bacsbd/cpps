const express = require('express');
const {login} = require('middlewares/login');
const User = require('mongoose').model('User');
// const Gate = require('mongoose').model('Gate');
// const Classroom = require('mongoose').model('Classroom');
const recaptcha = require('express-recaptcha');
// const rootPath = require('world').rootPath;
// const path = require('path');
// const ojnames = require(path.join(rootPath, 'models', 'ojnames.js'));
// const _ = require('lodash');
// const ojscraper = require('ojscraper');

const router = express.Router(); // '/user/profile'

router
  .get('/change-password', recaptcha.middleware.render, getChangePassword);
router
  .post('/change-password', recaptcha.middleware.verify, postChangePassword);
router.get('/set-username', getSetUsername);
router.post('/set-username', postSetUsername);
router.post('/set-userId', postSetUserId);
// router.post('/sync-ojsolve/:ojname', postSyncOjname);

// TODO: account should be separate from profile
router.get('/:username', getProfile);

module.exports = {
  addRouter(app) {
    app.use('/user/profile', login, router);
  },
};

/**
 *Implementation
 */

async function getProfile(req, res) {
  const username = req.params.username;

  return res.redirect(`/users/profile/${username}`);

  // const user = await User.findOne({username});
  // const data = {};
  // _.forEach(ojnames.data, function(oj) {
  //   data[oj.name] = _.cloneDeep(oj);
  // });
  // _.forEach(user.ojStats, function(userId) {
  //   data[userId.ojname].userId = userId.userIds;
  //   data[userId.ojname].solveCount = userId.solveCount;
  // });
  // let dataSorted = [];
  // _.forEach(data, function(x) {
  //   dataSorted.push(x);
  // });
  // dataSorted = _.orderBy(data, ['name']);
  //
  // const displayUser = {
  //   username: user.username,
  //   status: user.status,
  // };
  //
  // const owner = username === req.session.username;
  //
  // let classrooms = [];
  // if (owner) {
  //   const userId = req.session.userId;
  //   classrooms = await Classroom.find({students: userId})
  //     .select('name coach').populate('coach', 'username').exec();
  // }
  //
  // return res.render('user/profile', {
  //   data: dataSorted,
  //   displayUser,
  //   owner,
  //   classrooms,
  // });
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

  const username = req.session.username;

  User.findOne({
      username,
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
        return res.redirect(`/user/profile/${username}`);
      });
    });
}

function getSetUsername(req, res) {
  if ( req.session.username ) {
    return res.redirect(`/user/profile/${req.session.username}`);
  }
  return res.render('user/setUsername');
}

function postSetUsername(req, res) {
  if ( req.session.username ) {
    return res.redirect(`/user/profile/${req.session.username}`);
  }

  let username = req.body.username;

  // TODO: Validate username
  if ( !username ) {
    req.flash('error', 'Empty username');
    return res.redirect('/user/profile/set-username');
  }

  username = username.trim();
  const usernameRegex = /^[A-Za-z_0-9.]+$/g;
  if ( !usernameRegex.test(username) ) {
    req.flash('error', 'Username can only contain alphanumeric letters, dot and _');
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

// User has profile in various OJ. This collects those userIds
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
    return res.redirect(`/user/profile/${username}`);
  } catch (err) {
    if ( err.name === 'OJEXIST' ) {
      req.flash('error', err.message);
      return res.redirect(`/user/profile/${username}`);
    }
    return next(err);
  }
}

// async function postSyncOjname(req, res, next) {
//   const ojname = req.params.ojname;
//   const username = req.session.username;
//
//   if (ojname === 'vjudge') {
//     req.flash('info', 'You cannot sync vjudge directly. Sync individual oj.');
//     return res.redirect(`/user/profile/${req.session.username}`);
//   }
//   try {
//     const user = await User.findById(req.session.userId);
//
//     const ojStat = _.filter(user.ojStats, function(x) {
//       return x.ojname === ojname;
//     })[0];
//
//     // Grab vjudge if available
//     const vjudgeStat = _.filter(user.ojStats, function(x) {
//       return x.ojname === 'vjudge';
//     })[0];
//
//     const credential =
//       _.get(require('world').secretModule, 'ojscraper.loj.credential');
//
//     const ojUserId = ojStat.userIds[0];
//     const scrap = await ojscraper.getUserInfo({
//       ojname, username: ojUserId, credential,
//     });
//
//     let vjudgeUserId;
//     let vjudgeScrap = {
//       solveList: [],
//     };
//     if (vjudgeStat) {
//       vjudgeUserId = vjudgeStat.userIds[0];
//       vjudgeScrap = await ojscraper.getUserInfo({
//         ojname: 'vjudge', username: vjudgeUserId, subojname: ojname,
//       });
//     }
//
//     const totalSolveList = _.union(scrap.solveList, vjudgeScrap.solveList);
//     const totalScrapSolveCount = totalSolveList.length;
//
//     // if ( ojStat.solveCount && ojStat.solveCount >= totalScrapSolveCount ) {
//     //   req.flash('info', 'Already uptodate');
//     //   return res.redirect(`/user/profile/${username}`);
//     // }
//
//     ojStat.solveCount = totalScrapSolveCount;
//     const newSolved = _.difference(totalSolveList, ojStat.solveList);
//     ojStat.solveList = _.orderBy(totalSolveList);
//
//     await user.save();
//
//     // Synchronize newly solved problems
//     await Gate.update({
//       platform: ojStat.ojname,
//       pid: {
//         $in: newSolved,
//       },
//     }, {
//       $addToSet: {
//         doneList: user.username,
//       },
//     }, {
//       multi: true,
//     });
//
//     req.flash('success', 'Successfully updated profile');
//     return res.redirect(`/user/profile/${username}`);
//   } catch(err) {
//     next(err);
//   }
// }
