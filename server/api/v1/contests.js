const express = require('express');
const {isRoot} = require('middlewares/userGroup');
const Contest = require('mongoose').model('Contest');

const router = express.Router();

router.post('/contests', postInsertContest);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', isRoot, router);
  },
};

async function postInsertContest(req, res, next) {
  try {
    const {name, link, standings} = req.body;
  } catch (err) {
    return next(err);
  }
}
