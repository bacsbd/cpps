const express = require('express');
const mongoose = require('mongoose');
const Classroom = mongoose.model('Classroom');
const login = require('middlewares/login');

const router = express.Router();

router.get('/classroom', getClassroom);
router.get('/classroom/:classId', getOneClassroom);
router.post('/classroom', insertClassroom);
router.put('/classroom/:classId', updateClassroom);
router.delete('/classroom/:classId', deleteClassroom);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', login, router);
  },
};
/**
 *Implementation
 */

async function getClassroom(req, res, next) {
  try {
    const {coach} = req.query;
    const dbQuery = {};
    if (coach) {
      dbQuery.coach = mongoose.Types.ObjectId(coach);
    }
    const classrooms = await Classroom.find(dbQuery).exec();
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
    const {classId} = req.params;
    const classroom = await Classroom
      .findOne({_id: classId})
      .populate('coach students')
      .exec();
    return res.status(200).json({
      status: 200,
      data: classroom,
    });
  } catch (err) {
    return next(err);
  }
}

async function insertClassroom(req, res, next) {
  try {
    const {name, students} = req.body;
    if (!name || !students) {
      throw new Error('Post body must have name and students field');
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
    if (!name || !students) {
      throw new Error('Post body must have name and students field');
    }
    const classroom = await Classroom.findOneAndUpdate({_id: classId}, {
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
    await Classroom.findOneAndRemove({_id: classId}).exec();
    return res.status(204).json({
      status: 204,
    });
  } catch (err) {
    next(err);
  }
}
