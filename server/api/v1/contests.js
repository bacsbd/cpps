const express = require('express');
const {isRoot} = require('middlewares/userGroup');
const Contest = require('mongoose').model('Contest');
const Standing = require('mongoose').model('Standing');

const router = express.Router();

router.get('/contests', getContests);
router.post('/contests', insertContest);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', isRoot, router);
  },
};

async function getContests(req, res, next) {
  try {
    const {classroomId} = req.query;
    if (!classroomId) {
      const e = new Error('classroomId query is missing');
      e.status = 400;
      throw e;
    }
    const contests = await Contest.find({classroomId}).exec();
    return res.status(200).json({
      status: 200,
      data: contests,
    });
  } catch (err) {
    next(err);
  }
}

async function insertContest(req, res, next) {
  // TODO: Check if classroom belongs to user
  const {name, link, classroomId, standings} = req.body;
  const contest = new Contest({name, link, classroomId});
  try {
    await contest.save();
  } catch (err) {
    err.message = err.message + ' Error during contest creation';
    err.status = 500;
    err.type = 'contest-error';
    return next(err);
  }

  try {
    const contestId = contest._id;
    await Promise.all(standings.map(async (s)=>{
      const standing = new Standing({
        username: s.username,
        userId: s.userId,
        position: s.position,
        contestId,
        classroomId,
        previousRating: s.previousRating,
        newRating: s.newRating,
      });
      await standing.save();
      return standing;
    }));

    return res.status(201).json({
      status: 201,
      data: contest,
    });
  } catch (err) {
    err.message = err.message + ' Error in standings creation';
    err.status = 500;
    err.type = 'standings-error';
    return next(err);
  }
}
