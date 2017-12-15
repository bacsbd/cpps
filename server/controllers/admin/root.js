/**
  URL Path: /root
  Dashboard for root
*/

const express = require('express');
const settings = require('settings');
const userGroup = require('middlewares/userGroup');

const router = express.Router();

router.get('/settings', get_settings);
router.post('/settings/:key', post_settings);

module.exports = {
  addRouter(app) {
    app.use('/root', userGroup.isRoot, router);
  }
};

/**
 * Implementation
 */

function get_settings( req, res, next ) {
  return res.render('root/settings', {
    settings: settings.getAll()
  });
}

function post_settings( req, res, next ) {
  const key = req.params.key;
  const value = req.body.value;

  settings.setKey(key,value)
    .then(function(){
      req.flash('success', 'Settings saved');
      return res.redirect('/root/settings');
    })
    .catch(next);
}
