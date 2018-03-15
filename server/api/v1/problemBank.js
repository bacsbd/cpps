const express = require('express');
const ProblemBank = require('mongoose').model('ProblemBank');
const path = require('path');
const {rootPath} = require('world');
const {ojnamesOnly} = require(path.join(rootPath, 'models/ojnames'));
const ojscraper = require('ojscraper');

const router = express.Router();

router.get('/problembanks/:platform/:problemID', getProblem);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', router);
  },
};

async function getProblem(req, res, next) {
  const {platform, problemID} = req.params;

  if (ojnamesOnly.findIndex((x)=>x===platform) === -1) {
    return res.status(400).json({
      status: 400,
      message: `No such platform: ${platform} in problem bank`,
    });
  }

  try {
    const problem = await ProblemBank.findOne({
      platform,
      problemID,
    }).exec();

    // Problem found in bank
    if (problem) {
      return res.status(200).json({
        status: 200,
        data: problem,
      });
    }

    const credential = require('world').secretModule.ojscraper.loj.credential;
    const info = await ojscraper.getProblemInfo({
      ojname: platform, problemID, credential,
    });

    const newProblem = new ProblemBank(info);
    await newProblem.save();

    return res.status(200).json({
      status: 200,
      data: newProblem,
    });
  } catch (err) {
    return next(err);
  }
}
