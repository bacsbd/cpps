const express = require('express');
const Gate = require('mongoose').model('Gate');
const User = require('mongoose').model('User');
const _ = require('lodash');

const router = express.Router();

router.get('/recent', getRecent);
router.get('/sync-problems', syncProblems);
router.get('/done-list/:itemId', getDoneList);

module.exports = {
  addRouter(app) {
    app.use('/gateway', router);
  },
  usersThatSolved,
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

async function getDoneList(req, res) {
  const itemId = req.params.itemId;
  const item = await Gate.findById(itemId, {
    platform: 1,
    pid: 1,
    title: 1,
    doneList: 1,
  }).exec();
  return res.render('gateway/doneList.pug', {
    title: `Done List of ${item.platform} ${item.pid} - ${item.title}`,
    doneList: item.doneList,
  });
}
