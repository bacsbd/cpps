const express = require('express');
const ojscraper = require('ojscraper');
const router = express.Router();
const grabMiddleware = require('forthright48/world').grabMiddleware;
const {isAdmin} = grabMiddleware('userGroup');

router.get('/problemInfo/:ojname/:problemID', get_problemInfo);

module.exports = {
  addRouter(app) {
    app.use('/gateway/ojscraper', isAdmin, router);
  }
};

/**
 *Implementation
 */
async function get_problemInfo(req, res, next){
  const {ojname, problemID} = req.params;
  try {
    const info = await ojscraper.getProblemInfo({ojname, problemID});
    return res.json(info);
  } catch (err) {
    return res.json({error: err});
  }
}
