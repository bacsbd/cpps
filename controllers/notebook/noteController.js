const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const rootMiddleware = grabMiddleware('root');
const Notebook = require('mongoose').model('Notebook');
const marked = require('marked');
const escapeLatex = require('forthright48/escapeLatex');

const router = express.Router();

router.get('/', get_index);
router.get('/add-note', rootMiddleware, get_addNote);
router.post('/add-note', rootMiddleware, post_addNote);
router.get('/edit-note/:slug', get_editNote_Slug);
router.post('/edit-note/:slug', post_editNote_Slug);
router.post('/delete-note/:slug', post_deleteNote_Slug);
router.get('/view-note/:slug', get_viewNote_Slug);

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
      if (err.code === 11000) {
        req.flash('error', 'Slug name already exists');
      } else {
        req.flash('error', `Some error with code ${err.code}`);
      }
      req.flash('context', req.body);
      return res.redirect('/notebook/add-note');
    }
    req.flash('success', 'Saved successfully');
    req.flash('context', req.body);
    return res.redirect(`/notebook/edit-note/${req.body.slug}`);
  });
}

function get_editNote_Slug(req, res, next) {
  const pslug = req.params.slug;

  Notebook.findOne({
    slug: pslug
  }).exec(function(err, note) {
    if (err) {
      return next(err);
    }
    if (!note) {
      req.flash('error', 'No such note found');
      return res.redirect('/notebook');
    }

    return myRender(req, res, 'notebook/editNote', {
      title: note.title,
      slug: note.slug,
      body: note.body
    });
  });
}

function post_editNote_Slug(req, res, next) {
  const pslug = req.params.slug;

  const {
    title,
    slug,
    body
  } = req.body;

  Notebook.findOne({
    slug: pslug
  }).exec(function(err, note) {
    if (err) {
      return next(err);
    }
    if (!note) {
      req.flash('error', 'No such note found');
      return res.redirect('/notebook');
    }

    note.title = title;
    note.slug = slug;
    note.body = body;

    note.save(function(err) {
      if (err) {
        if (err.code === 11000) {
          req.flash('error', 'Slug name already exists');
          req.body.slug = pslug;
        } else {
          req.flash('error', `Some error with code ${err.code}`);
        }
      } else {
        req.flash('success', 'Edited successfully');
      }
      req.flash('context', req.body);
      return res.redirect(`/notebook/edit-note/${req.body.slug}`);
    });
  });
}

function post_deleteNote_Slug(req, res) {
  const pslug = req.params.slug;
  const slug = req.body.slug;

  if (slug !== pslug) {
    req.flash('error', 'Slug did not match for deletion');
    return res.redirect(`/edit-note/${pslug}`);
  }

  Notebook.findOne({
      slug: pslug
    }).remove()
    .exec(function(err) {
      if (err) {
        req.flash('error', 'Delete failed. Try again.');
        return res.redirect(`/edit-note/${pslug}`);
      }
      req.flash('success', 'Successfully deleted');
      return res.redirect('/notebook');
    });
}

function get_viewNote_Slug(req, res, next) {
  const slug = req.params.slug;

  Notebook.findOne({
      slug
    })
    .exec(function(err, note) {
      if (err) return next(err);
      if (!note) {
        req.flash('error', 'No such note found');
        return res.redirect('/notebook');
      }

      const body = escapeLatex(note.body);

      marked(body, function(err, content) {
        if (err) return next(err);
        note.body = content;
        return myRender(req, res, 'notebook/viewNote', {
          note
        });
      });
    });
}
