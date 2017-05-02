const express = require('express');
const {
  myRender
} = require('forthright48/world');
const Gate = require('mongoose').model('Gate');

const router = express.Router();

router.get('/recent', get_recent);

module.exports = {
  addRouter(app) {
    app.use('/gateway', router);
  }
};

/**
 *Implementation
 */
function get_recent(req, res, next) {
  /**Responsible for showing recent problem list to user*/

  Gate
    .find({
      type: 'problem'
    })
    .select('createdAt createdBy title platform pid parentId')
    .sort({
      createdAt: -1
    })
    .limit(25)
    .exec(function(err, problems) {
      if (err) {
        return next(err);
      }
      return myRender(req, res, 'gateway/recent', {
        problems
      });
    });
}
