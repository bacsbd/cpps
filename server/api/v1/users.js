const express = require('express');
const router = express.Router();
const {isRoot} = require('middlewares/userGroup');
const User = require('mongoose').model('User');
const Classroom = require('mongoose').model('Classroom');

router.get('/users/username-userId/:username', isRoot, getUserIdFromUsername );
router.get('/users/:username', isRoot, getUser );
router.get('/users/stats/whoSolvedIt', isRoot, whoSolvedIt );

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
