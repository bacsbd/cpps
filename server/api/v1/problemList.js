const express = require('express');
const ProblemList = require('mongoose').model('ProblemList');
const Classroom = require('mongoose').model('Classroom');
const User = require('mongoose').model('User');

const router = express.Router();

router.get('/problemlists', getProblemLists);
router.get('/problemlists/:problemListId', getSingleProblemList);
router.delete('/problemlists/:problemListId', deleteProblemList);

router.post('/problemlists', insertProblemList);
router.put('/problemlists/:problemListId/problems', addProblemToList);
router.delete('/problemlists/:problemListId/problems/:pid', deleteProblemFromList);

router.get('/problemlists/:problemListId/who-solved-it/classrooms/:classId', solveCountInClassroom);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', router);
  },
};

async function getProblemLists(req, res, next) {
  try {
    const {userId, username} = req.session;
    const {createdBy} = req.query;

    if (userId !== createdBy) {
      return next({
        status: 401,
        message: `You ${username}:${userId} cannot view list of ${createdBy}`,
      });
    }

    const problemLists = await ProblemList.find({createdBy}).exec();
    return res.status(200).json({
      status: 200,
      data: problemLists,
    });
  } catch (err) {
    return next(err);
  }
}

async function insertProblemList(req, res, next) {
  try {
    const {userId} = req.session;
    const {title} = req.body;

    const problemList = new ProblemList({
      title,
      createdBy: userId,
      problems: [],
    });

    await problemList.save();
    return res.status(201).json({
      status: 201,
      data: problemList,
    });
  } catch (err) {
    return next(err);
  }
}

async function getSingleProblemList(req, res, next) {
  try {
    const {problemListId} = req.params;

    if (!problemListId) {
      return next({
        status: 401,
        message: `ProblemListId cannot be blank`,
      });
    }

    const problemList = await ProblemList.findOne({_id: problemListId}).exec();

    if (problemList.createdBy.toString() !== req.session.userId) {
      return next({
        status: 401,
        message: `You do not have permission to view this list. Reason - You did not create this list.`,
      });
    }

    return res.status(200).json({
      status: 200,
      data: problemList,
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteProblemList(req, res, next) {
  try {
    const {problemListId} = req.params;

    if (!problemListId) {
      return next({
        status: 401,
        message: `ProblemListId cannot be blank`,
      });
    }

    await ProblemList.findByIdAndRemove(problemListId).exec();

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    return next(err);
  }
}

async function addProblemToList(req, res, next) {
  try {
    const {problemListId} = req.params;
    const {title, platform, problemId, link} = req.body;

    if (!problemListId || !title || !platform || !problemId || !link) {
      return next({
        status: 401,
        message: `Some parameters are blank`,
      });
    }

    const updatedList = await ProblemList.findOneAndUpdate({
      _id: problemListId,
      createdBy: req.session.userId,
    }, {
      $push: {
        problems: {
          title,
          platform,
          problemId,
          link,
        },
      },
    }, {
      new: true,
    });

    if (!updatedList) {
      return next({
        status: 401,
        message: `Problem List not found`,
      });
    }

    return res.status(201).json({
      status: 201,
      data: updatedList.problems[updatedList.problems.length-1],
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteProblemFromList(req, res, next) {
  try {
    const {problemListId, pid} = req.params;

    if (!problemListId || !pid) {
      return next({
        status: 401,
        message: `Some parameters are blank`,
      });
    }

    await ProblemList.findOneAndUpdate({
      _id: problemListId,
      createdBy: req.session.userId,
    }, {
      $pull: {
        problems: {
          _id: pid,
        },
      },
    });

    return res.status(201).json({
      status: 201,
    });
  } catch (err) {
    return next(err);
  }
}

async function solveCountInClassroom(req, res, next) {
  try{
    const {problemListId, classId} = req.params;

    const studentList = await Classroom.findById(classId).populate('students').exec();
    const problemList = await ProblemList.findById(problemListId).exec();

    if (studentList.coach.toString() !== problemList.createdBy.toString()) {
      return next({
        status: 401,
        message: 'Owner of classroom and problem list do not match',
      });
    }

    const studentIds = studentList.students.map((s)=>s._id);

    const resp = await Promise.all(problemList.problems.map(async (p)=>{
      const solvedBy = await User.find({
        _id: studentIds,
        ojStats: {
          $elemMatch: {
            ojname: p.platform,
            solveList: p.problemId,
          },
        },
      }).select('_id username').exec();
      return {
        _id: p._id,
        title: p.title,
        platform: p.platform,
        problemId: p.problemId,
        link: p.link,
        solvedBy: solvedBy.map((x)=>x.username),
        solveCount: solvedBy.length,
      }
    }));

    return res.status(200).json({
      status: 200,
      data: {
        ranklist: resp,
        studentUsernames: studentList.students.map((s)=>s.username),
      },
    });
  } catch (err) {
    return next(err);
  }
}
