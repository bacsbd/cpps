const express = require('express');
const router = express.Router();
const User = require('mongoose').model('User');
const Classroom = require('mongoose').model('Classroom');
const Gate = require('mongoose').model('Gate');
const ojscraper = require('ojscraper');
const _ = require('lodash');
const path = require('path');
const rootPath = require('world').rootPath;
const ojnames = require(path.join(rootPath, 'models/ojnames'));
const ojnamesOnly = ojnames.data.map((x)=>x.name);
const logger = require('logger');

router.get('/users/username-userId/:username', getUserIdFromUsername );
router.get('/users/stats/whoSolvedIt', whoSolvedIt );

router.get('/users/session', getSession);
router.get('/users/:username', getUser );
router.get('/users/:username/root-stats', rootStats);
router.put('/users/:username/sync-solve-count', syncSolveCount);

router.put('/users/:username/unset-oj-username/:ojname', unsetOjUsername);
router.put('/users/:username/set-oj-username/:ojname/:userId', setOjUsername);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', router);
  },
};

async function getUserIdFromUsername(req, res, next) {
  try{
    const {username} = req.params;
    if (!username) {
      const err = new Error(`Query 'username' must be provided`);
      err.status = 400;
      throw err;
    }
    const user = await User.findOne({username}, {_id: 1});
    if (!user) {
      const err = new Error(`Username ${username} not found`);
      err.status = 404;
      throw err;
    }
    return res.status(200).json({
      status: 200,
      data: user._id,
    });
  } catch(err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const {username} = req.params;
    const {select} = req.query;

    const user = await User.findOne({username}).select(select).exec();

    if (!user) {
      const err = new Error('No such user');
      err.status = 400;
      throw err;
    }

    // Remove sensitive information
    user.email = undefined;
    user.password = undefined;

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    return next(err);
  }
}

async function whoSolvedIt(req, res, next) {
  try{
    const {problemList, classId} = req.query;

    const studentList = await Classroom
      .findOne({_id: classId})
      .select({students: 1})
      .exec();

    const studentIds = studentList.students;

    const resp = await Promise.all(problemList.map(async (p)=>{
      const solvedBy = await User.find({
        _id: studentIds,
        ojStats: {
          $elemMatch: {
            ojname: p.ojname,
            solveList: p.problemId,
          },
        },
      }).select('_id username').exec();
      p.solvedBy = solvedBy.map((x)=>x.username);
      p.solveCount = solvedBy.length;
      return p;
    }));

    return res.status(200).json({
      status: 200,
      data: resp,
    });
  } catch (err) {
    return next(err);
  }
}

function getSession(req, res, next) {
  const s = req.session;
  return res.status(200).json({
    status: 200,
    data: {
      username: s.username,
      status: s.status,
      userId: s.userId,
      email: s.email,
    },
  });
}

async function rootStats(req, res, next) {
  const {username} = req.params;
  const parentId = '0'.repeat(24);

  try {
    const root = {
      _id: parentId,
    };
    if (!root) throw new Error(`No parent with id ${parentId}`);

    await setFolderStat(root, username);

    // Grab children under root
    const childrenModel = await Gate.find({parentId})
      .select('_id title').lean().exec();

    const childrenWithStat = await Promise.all(childrenModel
      .map(async (child)=>{
        await setFolderStat(child, username);
        return child;
      }));

    return res.json({
      status: 200,
      data: {
        root,
        children: childrenWithStat,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function setFolderStat(folder, username) {
  try {
    const totalProblems = await Gate.count({
      ancestor: folder._id,
      type: 'problem',
    }).exec();

    const userSolved = await Gate.count({
      ancestor: folder._id,
      type: 'problem',
      doneList: username,
    });

    folder.total = totalProblems;
    folder.user = userSolved;
  } catch (err) {
    throw err;
  }
}

async function syncSolveCount(req, res, next) {
  const username = req.params.username;
  logger.info(`syncSolveCount: ${req.session.username} has synced solve count of ${username}`);
  try {
    const user = await User.findOne({username});

    // Grab vjudge if available
    const vjudgeStat = _.filter(user.ojStats, function(x) {
      return x.ojname === 'vjudge';
    })[0];

    const credential = require('world').secretModule.ojscraper.loj.credential;

    // Handle missing ojs'
    const userHasOj = user.ojStats.map((x)=>x.ojname);
    const missingOjs = _.difference(ojnamesOnly, userHasOj);
    missingOjs.forEach((oj)=>{
      user.ojStats.push({
        ojname: oj,
        solveList: [],
        userIds: [],
      });
    });

    await Promise.all(user.ojStats.map(async function(ojStat) {
      const ojUserId = ojStat.userIds[0];
      const ojname = ojStat.ojname;
      if (ojname === 'vjudge') return 0;

      try {
        const scrap = {
          solveList: [],
        };

        if (ojUserId) {
          const ojscrap = await ojscraper.getUserInfo({
            ojname, username: ojUserId, credential,
          });
          scrap.solveList = ojscrap.solveList;
        }
        let vjudgeUserId;
        let vjudgeScrap = {
          solveList: [],
        };
        if (vjudgeStat && vjudgeStat.userIds[0]) {
          vjudgeUserId = vjudgeStat.userIds[0];
          vjudgeScrap = await ojscraper.getUserInfo({
            ojname: 'vjudge', username: vjudgeUserId, subojname: ojname,
          });
        }

        // If both ojid and vjudgeid is undefined, then solve is 0
        if (!ojUserId && ( !vjudgeStat || vjudgeStat && !vjudgeStat.userIds[0])) {
          ojStat.solveCount = 0;
          ojStat.solveList = [];
          return 0;
        }

        const totalSolveList = _.union(scrap.solveList, vjudgeScrap.solveList);
        const totalScrapSolveCount = totalSolveList.length;

        if ( ojStat.solveCount && ojStat.solveCount >= totalScrapSolveCount ) {
          return 0;
        }
        ojStat.solveCount = totalScrapSolveCount;
        const newSolved = _.difference(totalSolveList, ojStat.solveList);
        ojStat.solveList = _.orderBy(totalSolveList);

        // Synchronize newly solved problems
        await Gate.update({
          platform: ojname,
          pid: {
            $in: newSolved,
          },
        }, {
          $addToSet: {
            doneList: username,
          },
        }, {
          multi: true,
        });
        return 0;
      } catch (err) {
        logger.error(`error in ${ojname}:${ojUserId} for ${username}`);
      }
    }));

    await user.save();

    return res.status(201).json({
      status: 201,
      data: user.ojStats,
    });
  } catch (err) {
    return next(err);
  }
}

async function unsetOjUsername(req, res, next) {
  try {
    const username = req.session.username;
    const ojname = req.params.ojname;
    if (username !== req.params.username) {
      throw new Error(`UnsetOjUsername: {username} cannot unset oj username of ${req.params.username}`);
    }

    const user = await User.findOne({username}).exec();
    const ojStats = user.ojStats;

    const oj = ojStats.filter((x)=>x.ojname === ojname)[0];

    if (!oj) {
      throw new Error(`unsetOjUsername: No such oj ${ojname}`);
    }

    // Now, remove user from all problems present in solvelist

    const solveList = oj.solveList;

    await Gate.update({
      platform: ojname,
      pid: {
        $in: solveList,
      },
    }, {
      $pull: {
        doneList: username,
      },
    }, {
      multi: true,
    });

    logger.info(`unsetOjUsername: ${username} has removed ${ojname}:${oj.userIds[0]}`);

    oj.userIds = [];
    oj.solveCount = 0;
    oj.solveList = [];

    await user.save();

    return res.status(201).json({
      status: 201,
      data: user.ojStats,
    });
  } catch (err) {
    next(err);
  }
}

async function setOjUsername(req, res, next) {
  try {
    const username = req.session.username;
    const ojname = req.params.ojname;
    const userId = req.params.userId;
    if (username !== req.params.username) {
      throw new Error(`setOjUsername: {username} cannot unset oj username of ${req.params.username}`);
    }
    if (ojnamesOnly.findIndex((x)=>x === ojname) === -1) {
      throw new Error(`setOjUsername: no such ojname ${ojname}`);
    }

    const user = await User.findOne({username}).exec();
    const ojStats = user.ojStats;

    let oj = ojStats.filter((x)=>x.ojname === ojname)[0];

    if (!oj) {
      oj = {
        ojname,
        userIds: [],
        solveCount: 0,
        solveList: [],
      };
      ojStats.push(oj);
    }

    if (oj.userIds.length === 1) {
      throw new Error('setOjUsername: cannot set multiple userId');
    }

    oj.userIds = [userId];

    logger.info(`setOjUsername: ${username} has set userId for ${ojname}:${oj.userIds[0]}`);

    await user.save();

    return res.status(201).json({
      status: 201,
      data: user.ojStats,
    });
  } catch (err) {
    next(err);
  }
}
