const express = require('express');
const router = express.Router();

router.get('/', get_index);
router.get('/bugsandhugs', get_bugsandhugs);
router.get('/faq', get_faq);

module.exports = {
  addRouter(app) {
    app.use('/', router);
  }
};

/**
 *Implementation
 */
function get_index(req, res) {
  return res.render('index/index');
}

function get_bugsandhugs(req, res) {
  return res.render('index/bugsandhugs');
}

function get_faq(req, res) {
  return res.render('index/faq');
}
