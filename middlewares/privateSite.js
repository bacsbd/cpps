/**
 *Middle ware to make site private depending on settings
 */
const settings = require('../controllers/node_modules/settings');
module.exports = function(req, res, next) {
  if(settings.getKey('private_site') !== 'on') return next();
  const url = req.originalUrl;
  if ( url === '/' || url === '/user/login' || url === '/user/register' ) {
    return next();
  }
  const sess = req.session || {};
  if (sess.login) return next();
  else {
    req.flash('info', 'This is a private site. You must login to continue.');
    return res.redirect('/user/login');
  }
};
