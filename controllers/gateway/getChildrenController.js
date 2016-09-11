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
    ///Grab the root item
    root(cb) {
      Gate.findOne({
          _id: parentId
        })
        .exec(function(err, root) {
          if (err) return cb(err);
          getItemStats(req, root, cb);
        });
    },
    ///Grab children under root
    items(cb) {
      Gate.find({
          parentId
        })
        .sort({
          ind: 1
        })
        .exec(function(err, items) {
          if (err) return cb(err);

          async.forEach(items, function(item, itemCB) {
            getItemStats(req, item, itemCB);
          }, function(err) {
            if (err) return cb(err);
            return cb(null, items);
          });
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

///Responsible for getting total number of items under it's folder and how many user has solved
function getItemStats(req, item, cb) {
  if (item.type !== 'folder') {
    ///Nothing to do here
    return cb(null);
  }

  async.parallel({
    totalCount(pcb) {
      Gate.count({
          ancestor: item._id,
          type: {
            $in: ['problem', 'text']
          }
        })
        .exec(function(err, total) {
          if (err) return pcb(err);
          item.totalCount = total;
          return pcb(null);
        });
    },
    userCount(pcb) {
      const sess = req.session || {};
      ///Usercount is '--' if user is not logged in
      if (!sess.login) {
        item.userCount = '--';
        return pcb(null);
      }
      const id = sess.userId;
      Gate.count({
          ancestor: item._id,
          type: {
            $in: ['problem', 'text']
          },
          doneList: id
        })
        .exec(function(err, total) {
          if (err) return pcb(err);
          item.userCount = total;
          return pcb(null);
        });
    }
  }, function(err) {
    if (err) return cb(err);
    return cb(null, item);
  });
}
