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
const marked = require('marked');
const escapeLatex = require('forthright48/escapeLatex');
const async = require('async');

const router = express.Router();

router.get('/', get_index);
router.get('/add-item/:parentId', rootMiddleware, get_addItem_ParentId);
router.get('/edit-item/:id', rootMiddleware, get_editItem_Id);
router.post('/add-item', rootMiddleware, post_addItem);
router.post('/edit-item', rootMiddleware, post_editItem);
router.get('/get-children/:parentId', get_getChildren_ParentId);
router.post('/delete-item/:id', rootMiddleware, get_deleteItem_Id);
router.get('/read-item/:id', get_readItem_Id);

module.exports = {
  addRouter(app) {
    app.use('/gateway', router);
  }
};

/**
 *Implementation
 */

function get_index(req, res) {
  return res.redirect(`/gateway/get-children/${rootStr}`);
}

function get_addItem_ParentId(req, res) {
  const parentId = req.params.parentId;
  return myRender(req, res, 'gateway/addItem', {
    parentId,
    ojnames
  });
}

function get_editItem_Id(req, res, next) {
  const id = req.params.id;
  Gate.findOne({
      _id: id
    })
    .exec(function(err, item) {
      if (err) return next(err);
      if (!item) {
        req.flash('error', 'No such item found for edit');
        return res.redirect('/gateway');
      }
      return myRender(req, res, 'gateway/editItem', {
        item,
        ojnames
      });
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
  target.link = source.link;
}

function post_addItem(req, res, next) {
  const item = {};
  syncModel(item, req.body);

  ///Need to calculate the ancestor of this item.
  ///For that we need ancestor list of the parent

  Gate.findOne({
      _id: item.parentId
    })
    .select('ancestor')
    .exec(function(err, x) {
      if (err) return next(err);
      if (!x) {
        req.flash('error', `No such parent with id ${item.parentId}`);
        return res.redirect(`/gateway/add-item/${item.parentId}`);
      }
      item.ancestor = x.ancestor.concat(item.parentId);

      /// Ready to save our item
      const itemModel = new Gate(item);
      itemModel.save(function(err) {
        if (err) return next(err);
        return res.redirect(`/gateway/get-children/${item.parentId}`);
      });
    });
}

function post_editItem(req, res, next) {
  const id = req.body.id;
  ///Need to calculate the ancestor of this item.
  ///For that we need ancestor list of the parent

  Gate.findOne({
    _id: id
  }).exec(function(err, item) {
    if (err) return next(err);
    if (!item) {
      req.flash('error', 'No such item found for edit');
      return res.redirect(`/gateway/get-children/${rootStr}`);
    }
    syncModel(item, req.body);
    item.save(function(err) {
      if (err) return next(err);
      req.flash('success', 'Edit Successful');
      return res.redirect(`/gateway/edit-item/${id}`);
    });
  });
}

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

function get_deleteItem_Id(req, res, next) {
  const id = req.params.id;
  const parentId = req.body.parentId;
  if (req.body.delete !== 'Delete') {
    req.flash('error', 'Wrong word typed during Delete');
    return res.redirect(`gateway/edit-item/${id}`);
  }

  // TODO: cpps Issue 29

  Gate.findOne({
      _id: id
    })
    .remove()
    .exec(function(err) {
      if (err) return next(err);
      req.flash('success', 'Successfully deleted');
      return res.redirect(`/gateway/get-children/${parentId}`);
    });
}

function get_readItem_Id(req, res, next) {
  const id = req.params.id;

  Gate.findOne({
      _id: id
    })
    .select('title body parentId')
    .exec(function(err, item) {
      if (err) return next(err);
      if (!item) {
        req.flash('No item with such id');
        return res.redirect(`/gateway/get-children/${rootStr}`);
      }

      item.body = escapeLatex(item.body);
      marked(item.body, function(err, content) {
        if (err) return next(err);
        item.body = content;
        return myRender(req, res, 'gateway/readItem', {
          item
        });
      });
    });
}
