const express = require('express');
const {isRoot} = require('middlewares/userGroup');
const Contest = require('mongoose').model('Contest');
const Standing = require('mongoose').model('Standing');

const router = express.Router();

router.get('/contests', getContests);
router.post('/contests', isRoot, insertContest);
router.delete('/contests/:contestId', isRoot, deleteStandings);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', router);
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
  const {name, link, classroomId} = req.body;
  const contest = new Contest({name, link, classroomId});
  try {
    await contest.save();
    return res.status(201).json({
      status: 201,
      data: contest,
    });
  } catch (err) {
    err.message = err.message + ' Error during contest creation';
    err.status = 500;
    err.type = 'contest-error';
    return next(err);
  }
}

// Only allow deleting standings
async function deleteStandings(req, res, next) {
  // TODO: Check if classroom belongs to user
  const {contestId} = req.params;

  // Now remove all related standings
  try {
    await Standing.remove({contestId}).exec();
    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    err.message = err.message + ' Error in standings deletion';
    err.status = 500;
    err.type = 'standings-error';
    return next(err);
  }
}
