const express = require('express');
const {
  myRender,
  grabMiddleware
} = require('forthright48/world');
const rootMiddleware = grabMiddleware('root');

const router = express.Router();

router.get('/', get_index);
router.get('/add-note', rootMiddleware, get_addNote);

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
