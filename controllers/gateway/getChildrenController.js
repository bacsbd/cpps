const express = require('express');
const {
  myRender
} = require('forthright48/world');
const Gate = require('mongoose').model('Gate');
const async = require('async');

const router = express.Router();

router.get('/get-children/:parentId', get_getChildren_ParentId);

module.exports = {
  addRouter(app) {
    app.use('/gateway', router);
  }
};

/**
 *Implementation
 */

function get_getChildren_ParentId(req, res, next) {
  const parentId = req.params.parentId;

  ///Need to send the item with id parentId, so that we can use it's title and other info
  ///Also need all items whose parent is parentId.
  ///Both requires async calls

  async.parallel({
    root(cb) {
      Gate.findOne({
          _id: parentId
        })
        .exec(function(err, root) {
          if (err) return cb(err);
          return cb(null, root);
        });
    },
    items(cb) {
      Gate.find({
          parentId
        })
        .sort({
          ind: 1
        })
        .exec(function(err, items) {
          if (err) return cb(err);
          return cb(null, items);
        });
    }
  }, function(err, result) {
    if (err) return next(err);
    return myRender(req, res, 'gateway/getChildren', {
      root: result.root,
      items: result.items,
      doneList: []
    });
  });
}
