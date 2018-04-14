const express = require('express');
const mongoose = require('mongoose');
const {isAdmin} = require('middlewares/userGroup');
const Classroom = mongoose.model('Classroom');
const ProblemList = mongoose.model('ProblemList');
const User = mongoose.model('User');
const isObjectId = mongoose.Types.ObjectId.isValid;

const router = express.Router();

router.get('/classrooms', getClassroom);
router.post('/classrooms', isAdmin, insertClassroom);

router.get('/classrooms/:classId', getOneClassroom);
router.put('/classrooms/:classId', updateClassroom);
router.delete('/classrooms/:classId', deleteClassroom);

router.get('/classrooms/:classId/leaderboard', getLeaderboard);

router.post('/classrooms/:classId/students', postAddStudents);
router.delete('/classrooms/:classId/students/:studentId', deleteOneStudent);

router.get('/classrooms/:classId/problemlists', getProblemLists);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', router);
  },
};
/**
 *Implementation
 */

async function getClassroom(req, res, next) {
  try {
    const {coach = req.session.userId, student, select, populate=['', '']} = req.query;
    const dbQuery = {};

    if (coach) {
      dbQuery.coach = mongoose.Types.ObjectId(coach);
    }
    if (coach !== req.session.userId) {
      return next({
        status: 400,
        message: `You ${req.session.userId} are not allowed to view classrooms of ${coach}`,
      });
    }
    if (student) {
      dbQuery.students = student;
    }

    const classrooms = await Classroom.find(dbQuery)
      .select(select)
      .populate(populate[0], populate[1])
      .exec();
    return res.status(200).json({
      status: 200,
      data: classrooms,
    });
  } catch (err) {
    return next(err);
  }
}

async function getOneClassroom(req, res, next) {
  try {
    const {userId} = req.session;
    const {classId} = req.params;
    const classroom = await Classroom
      .findOne({_id: classId, $or: [{coach: userId}, {students: userId}]})
      .populate('coach students', 'username')
      .exec();

    if (!classroom) {
      return next({
        status: 400,
        message: 'Classroom doesn\'t exist or you do not have permission to view',
      });
    }
    return res.status(200).json({
      status: 200,
      data: classroom,
    });
  } catch (err) {
    return next(err);
  }
}

async function postAddStudents(req, res, next) {
  try {
    const {classId} = req.params;
    let {students} = req.body;
    const {userId} = req.session;

    students = students.filter((s)=> isObjectId(s));

    const classroom = await Classroom.findOneAndUpdate({
      _id: classId,
      coach: userId,
    }, {
      $addToSet: {
        students: {
          $each: students,
        },
      },
    });

    if (!classroom) {
      const e = new Error(`No such classroom: ${classId}`);
      e.status = 400;
      throw e;
    }

    return res.status(201).json({
      status: 201,
      data: classroom,
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteOneStudent(req, res, next) {
  try {
    const {classId, studentId} = req.params;
    const {userId} = req.session;

    const classroom = await Classroom.findOneAndUpdate({
      _id: classId,
      coach: userId,
    }, {
      $pull: {
        students: studentId,
      },
    });

    if (!classroom) {
      const e = new Error('No such classroom');
      e.status = 400;
      throw e;
    }

    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    return next(err);
  }
}

async function insertClassroom(req, res, next) {
  try {
    const {name, students} = req.body;
    if (!name || !students) {
      const err = new Error('Post body must have name and students field');
      err.status = 400;
      throw err;
    }
    if (!students.every(isObjectId)) {
      const err = new Error('Students must be an array of ObjectId');
      err.status = 400;
      throw err;
    }
    if ((new Set(students)).size !== students.length) {
      const err = new Error('Students array must contain unique Ids');
      err.status = 400;
      throw err;
    }

    const classroom = new Classroom({
      name,
      coach: req.session.userId,
      students,
    });
    await classroom.save();
    return res.status(201).json({
      status: 201,
      data: classroom,
    });
  } catch (err) {
    return next(err);
  }
}

async function updateClassroom(req, res, next) {
  try {
    const {name, students} = req.body;
    const {classId} = req.params;
    const {userId} = req.session;
    if (!name || !students) {
      throw new Error('Post body must have name and students field');
    }
    const classroom = await Classroom.findOneAndUpdate({
        _id: classId,
        coach: userId, // This ensures user is the owner
      }, {
      name,
      coach: req.session.userId,
      students,
    });

    return res.status(201).json({
      status: 201,
      data: classroom,
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteClassroom(req, res, next) {
  try {
    const {classId} = req.params;
    const {userId} = req.session;

    await ProblemList.update({
      sharedWith: classId,
    }, {
      $pull: {
        sharedWith: classId,
      },
    }, {
      multi: true,
    }).exec();

    await Classroom.findOneAndRemove({
      _id: classId,
      coach: userId,
    }).exec();
    return res.status(200).json({
      status: 200,
    });
  } catch (err) {
    next(err);
  }
}

async function getProblemLists(req, res, next) {
  try {
    const {classId} = req.params;

    if (!classId || !isObjectId(classId)) {
      return next({
        status: 401,
        message: `classId:${classId} is not a valid objectId`,
      });
    }

    const problemLists = await ProblemList.find({
      sharedWith: classId,
    }).populate('createdBy', 'username')
    .select('title').exec();

    return res.status(200).json({
      status: 200,
      data: problemLists,
    });
  } catch (err) {
    next(err);
  }
}

async function getLeaderboard(req, res, next) {
  const {classId} = req.params;
  try {
    const studentList = await Classroom.findById(classId).select('students').exec();
    const studentsIdList = studentList.students;

    const userData = await User.aggregate([
      {$match: {_id: {$in: studentsIdList}}},
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
    userData.forEach(function(user) {
      const d = {};
      d.username = user.username;
      d.totalSolved = user.totalSolved;
      user.ojStats.forEach(function(stat) {
        let {ojname, solveCount} = stat;
        if (!solveCount) solveCount = 0;
        d[ojname] = solveCount;
      });
      data.push(d);
    });

    return res.status(200).json({
      status: 200,
      data,
    });
  } catch (err) {
    next(err);
  }
}
