const express = require('express');
const path = require('path');
const {
  myRender,
  grabMiddleware,
  rootPath
} = require('forthright48/world');
const rootMiddleware = grabMiddleware('root');
const Gate = require('mongoose').model('Gate');
const ojnames = require(path.join(rootPath, 'models/ojnames.js'));
const rootStr = '000000000000000000000000';
const rootObj = Gate.getRoot();

const router = express.Router();

router.get('/', get_index);
router.get('/add-item/:parentId', rootMiddleware, get_addItem_ParentId);
router.post('/add-item', rootMiddleware, post_addItem);


module.exports = {
  addRouter(app) {
    app.use('/gateway', router);
  }
};

/**
 *Implementation
 */

function get_index(req, res) {
  return res.redirect(`/get-children/${rootStr}`);
}

function get_addItem_ParentId(req, res) {
  const parentId = req.params.parentId;
  return myRender(req, res, 'gateway/addItem', {
    parentId,
    ojnames
  });
}

function syncModel(target, source) {
  target.type = source.type;
  target.parentId = source.parentId;
  target.ind = source.ind;
  target.title = source.title;
  target.body = source.body;
  target.platform = source.platform;
  target.pid = source.pid;
  target.link = source.lin;
}

function post_addItem(req, res, next) {
  const item = {};
  syncModel(item, req.body);

  ///Need to calculate the ancestor of this item.
  ///For that we need ancestor list of the parent

  if (item.parentId === rootStr) item.ancestor = [rootObj];
  else {
    Gate.findOne({
        _id: item.parentId
      })
      .select('ancestor')
      .exec(function(err, x) {
        if (err) return next(err);
        item.ancestor = x.ancestor.concat(rootObj);

        ///With all prepared, we are ready to save it
        const itemModel = new Gate(item);

        itemModel.save(function(err) {
          if (err) return next(err);
          return res.redirect(`/gateway/get-children/${item.parentId}`);
        });
      });
  }
}
