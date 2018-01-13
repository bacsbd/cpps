const express = require('express');
const Gate = require('mongoose').model('Gate');
const User = require('mongoose').model('User');
const _ = require('lodash');
const path = require('path');
const rootPath = require('world').rootPath;
const ojnames = require(path.join(rootPath, 'models/ojnames.js')).data;
const {isRoot} = require('middlewares/userGroup');
const {login} = require('middlewares/login');

const router = express.Router();

router.get('/recent', getRecent);
router.get('/sync-problems', isRoot, syncProblems);
router.get('/done-list/:itemId', getDoneList);
router.get('/leaderboard', getLeaderboard);
router.get('/random-problem', login, getRandomProblem);
router.get('/search-problem', getSearchProblem);
router.post('/search-problem', postSearchProblem);

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

async function syncProblems(req, res, next) {
  req.flash('info', 'Processing the request. It will take a while.');
  res.redirect('/admin/dashboard');

  try {
    const problems = await Gate.find({
      type: 'problem',
    }, {platform: 1, pid: 1}).exec();

    _.each(problems, async function(p) {
      // Get users that solved this problem
      const doneList = await usersThatSolved(p.platform, p.pid);
      // Update doneList
      await Gate.findOneAndUpdate({_id: p._id}, {$set: {doneList}});
    });
  } catch (err) {
    next(err);
  }
}

async function getDoneList(req, res) {
  const itemId = req.params.itemId;
  try{
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
  } catch (err) {
    next(err);
  }
}

async function getLeaderboard(req, res, next) {
  try{
    const userData = await User.aggregate([
      {$match: {username: {$exists: true}}},
      {$project: {username: 1, _id: 0, ojStats: 1}},
      {$unwind: '$ojStats'},
      {
        $project: {
          username: 1,
          ojname: '$ojStats.ojname',
          solveCount: '$ojStats.solveCount',
        }},
      {
        $group: {
          _id: '$username',
          totalSolved: {$sum: '$solveCount'},
          ojStats: {
            $push: {
              ojname: '$ojname',
              solveCount: '$solveCount',
            }}}},
      {$project: {_id: 0, username: '$_id', totalSolved: 1, ojStats: 1}},
      {$sort: {totalSolved: -1, username: 1}},
    ]);

    const data = [];
    _.each(userData, function(user) {
      const d = {};
      d.username = user.username;
      d.totalSolved = user.totalSolved;
      _.each(user.ojStats, function(stat) {
        let {ojname, solveCount} = stat;
        if (!solveCount) solveCount = 0;
        d[ojname] = solveCount;
      });
      data.push(d);
    });

    return res.render('gateway/leaderboard', {data, ojnames});
  } catch (err) {
    next(err);
  }
}

async function getRandomProblem(req, res, next) {
  try{
    const username = req.session.username;
    const problemArr = await Gate.aggregate([
      {$match: {type: 'problem', doneList: {$ne: username}}},
      {$sample: {size: 1}},
    ]);
    const problem = problemArr[0];
    problem.userSolved = problem.doneList.length;
    return res.render('gateway/random', {problem});
  } catch(err) {
    next(err);
  }
}

function getSearchProblem(req, res) {
  return res.render('gateway/search', {
    ojnames,
  });
}

async function postSearchProblem(req, res, next) {
  const {platform, pid} = req.body;

  try {
    const problem = await Gate.findOne({
      type: 'problem',
      platform,
      pid,
    }).exec();
    if (!problem) {
      req.flash('error', 'No such problem in Gateway');
      return res.redirect('/gateway/search-problem');
    }
    req.flash('success', 'Problem found');
    return res.redirect(
      `/gateway/get-children/${problem.parentId}#${problem._id}`
    );
  } catch(e) {
    next(e);
  }
}
