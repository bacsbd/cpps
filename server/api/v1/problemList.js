const express = require('express');
const ProblemList = require('mongoose').model('ProblemList');

const router = express.Router();

router.get('/problemlists', getProblemLists);
router.post('/problemlists', insertProblemList);

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
