const express = require('express');
const {isRoot} = require('middlewares/userGroup');
const Contest = require('mongoose').model('Contest');
const Standing = require('mongoose').model('Standing');
const Classroom = require('mongoose').model('Classroom');

const router = express.Router();

router.get('/contests', getContests);
router.get('/contests/:contestId', getContest);
router.put('/contests/:contestId', editContest);
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

async function getContest(req, res, next) {
  try {
    const {contestId} = req.params;
    const contest = await Contest.findById(contestId).exec();
    return res.status(200).json({
      status: 200,
      data: contest,
    });
  } catch (err) {
    next(err);
  }
}

async function insertContest(req, res, next) {
  const {name, link, classroomId} = req.body;
  const {userId} = req.session;

  try {
    const classroom = await Classroom.findOne({_id: classroomId})
      .select('coach')
      .exec();

    if (!classroom) {
      const e = new Error(`No such classroom with id ${classroom}`);
      e.status = 400;
      throw e;
    }

    if (classroom.coach.toString() !== userId.toString()) {
      const e = new Error(`You are not the owner of this classroom`);
      e.status = 400;
      throw e;
    }
  } catch (err) {
    err.message = err.message + ' Error during contest creation';
    err.status = 500;
    err.type = 'contest-error';
    return next(err);
  }

  const contest = new Contest({name, link, classroomId, coach: userId});
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

async function editContest(req, res, next) {
  const {name, link} = req.body;
  const {userId} = req.session;
  const {contestId} = req.params;

  try {
    const contest = await Contest.findOneAndUpdate(
      {_id: contestId, coach: userId},
      {
        $set: {
          name,
          link,
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json({
      status: 200,
      data: contest,
    });
  } catch (err) {
    err.message = err.message + ' Error during contest update';
    err.status = 500;
    err.type = 'contest-error';
    return next(err);
  }
}

// Only allow deleting standings
async function deleteStandings(req, res, next) {
  const {contestId} = req.params;
  const {userId} = req.session;

  // Now remove all related standings
  try {
    await Standing.remove({
      contestId,
      coach: userId,
    }).exec();
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
