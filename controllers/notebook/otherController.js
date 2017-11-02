const express = require('express');
const Notebook = require('mongoose').model('Notebook');

const router = express.Router();

router.get('/recent', get_recent);

module.exports = {
  addRouter(app) {
    app.use('/notebook', router);
  }
};

/**
 *Implementation
 */
function get_recent(req, res, next) {
  Notebook
    .find()
    .select('updatedAt createdAt title slug')
    .sort({
      updatedAt: -1
    })
    .limit(25)
    .exec(function(err, notes) {
      if (err) {
        return next(err);
      }
      return res.render('notebook/recent', {
        notes
      });
    });
}
