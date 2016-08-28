/*Middle ware to test whether user is root or not*/

module.exports = function(req, res, next) {
  const sess = req.session || {};
  if (sess.status === 'root') return next();
  else {
    req.flash('info', 'You must be root to proceed');
    return res.redirect('/');
  }
};
