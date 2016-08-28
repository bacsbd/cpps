/**
 *Middle ware to test whether user is logged in or not
 */

module.exports = function(req, res, next) {
  const sess = req.session || {};
  if (sess.login) next();
  else {
    req.flash('info', 'Please login and try again');
    return res.redirect('/user/login');
  }
};
