const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const rootMiddleware = grabMiddleware('root');
const Notebook = require('mongoose').model('Notebook');

const router = express.Router();

router.get('/', get_index);
router.get('/add-note', rootMiddleware, get_addNote);
router.post('/add-note', rootMiddleware, post_addNote);

module.exports = {
  addRouter(app) {
    app.use('/notebook', router);
  }
};

/**
 *Implementation
 */
function get_index(req, res) {
  return myRender(req, res, 'notebook/index');
}

function get_addNote(req, res) {
  return myRender(req, res, 'notebook/addNote');
}

function post_addNote(req, res) {
  const note = new Notebook({
    title: req.body.title,
    slug: req.body.slug,
    body: req.body.body
  });

  note.save(function(err) {
    if (err) {
      req.flash('error', 'Some error occured');
    } else {
      req.flash('success', 'Saved successfully');
    }

    req.flash('context', req.body);
    return res.redirect(`/notebook/edit-note/${req.body.slug}`);
  });
}
