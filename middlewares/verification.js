/*Redirect users to verification route if they are logged in but not verified yet
One time use only
*/
module.exports = function(req, res, next) {
  const sess = req.session || {};
  const url = req.originalUrl;
  if (sess.login && !sess.verified && url !== '/user/verify' && url !== '/user/logout') {
    req.flash('info', 'Please verify your email')
    return res.redirect('/user/verify');
  }
  return next();
};
