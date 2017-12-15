const express = require('express');
const ojscraper = require('ojscraper');
const router = express.Router();
const {isAdmin} = require('middlewares/userGroup');

router.get('/problemInfo/:ojname/:problemID', isAdmin, getProblemInfo);
router.get('/userInfo/:ojname/:username', getUserInfo);

module.exports = {
  addRouter(app) {
    app.use('/gateway/ojscraper', router);
  },
};

async function getProblemInfo(req, res, next) {
  const {ojname, problemID} = req.params;
  try {
    const info = await ojscraper.getProblemInfo({ojname, problemID});
    return res.json(info);
  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
}

async function getUserInfo(req, res, next) {
  const {ojname, username} = req.params;
  const subojname = 'uva';
  try {
    const info = await ojscraper.getUserInfo({ojname, username, subojname});
    return res.json({
      solveCount: info.solveCount,
    });
  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
}
