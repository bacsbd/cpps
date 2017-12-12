const express = require('express');
const Gate = require('mongoose').model('Gate');
const User = require('mongoose').model('User');
const _ = require('lodash');

const router = express.Router();

router.get('/recent', getRecent);
router.get('/sync-problems', syncProblems);

module.exports = {
  addRouter(app) {
    app.use('/gateway', router);
  },
};

function getRecent(req, res, next) {
  /** Responsible for showing recent problem list to user*/

  Gate
    .find({type: 'problem'})
    .select('createdAt createdBy title platform pid parentId')
    .sort({createdAt: -1})
    .limit(25)
    .exec(function(err, problems) {
      if (err) {
        return next(err);
      }
      return res.render('gateway/recent', {problems});
    });
}

async function usersThatSolved(ojname, problemId) {
  try {
    const userList = await User.find({
      ojStats: {
        $elemMatch: {
          ojname,
          solveList: problemId,
        },
      },
    }, {username: 1}).exec();
    return userList.map((x)=> x.username);
  } catch (err) {
    throw err;
  }
}

async function syncProblems(req, res) {
  req.flash('info', 'Processing the request. It will take a while.');
  res.redirect('/admin/dashboard');

  const problems = await Gate.find({
    type: 'problem',
  }, {platform: 1, pid: 1}).exec();

  _.each(problems, async function(p) {
    // Get users that solved this problem
    const doneList = await usersThatSolved(p.platform, p.pid);
    // Update doneList
    await Gate.findOneAndUpdate({_id: p._id}, {$set: {doneList}});
  });
}
