const express = require('express');
const myRender = require('forthright48/world').myRender;

const router = express.Router();

router.get('/', get_index);

module.exports = {
  addRouter(app) {
    app.use('/notebook', router);
  }
};

/**
 *Implementation
 */
function get_index(req, res) {
  myRender(req, res, 'notebook/index');
}
