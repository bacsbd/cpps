const express = require('express');
const {isRoot} = require('middlewares/userGroup');
const Standing = require('mongoose').model('Standing');

const router = express.Router();

router.get('/standings', getStandings);


module.exports = {
  addRouter(app) {
    app.use('/api/v1', isRoot, router);
  },
};

async function getStandings(req, res, next) {
  try {
    const {contestId} = req.query;
    if (!contestId) {
      const e = new Error(
        `contestId: ${contestId} query is missing`);
      e.status = 400;
      throw e;
    }
    const standings = await Standing.find({contestId}).exec();

    return res.status(200).json({
      status: 200,
      data: standings,
    });
  } catch (err) {
    next(err);
  }
}
