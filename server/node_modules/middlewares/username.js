/**
 * A middleware that blocks user from progressing if their username is not set
 *
 * Blocks only if user is logged in and verified.
 */
module.exports = function(req, res, next) {
  if ( !req.session.login ) return next();
  if ( !req.session.verified) return next();

  // Don't stop if user is logging out or setting username
  const url = req.originalUrl;
  if ( url === '/user/profile/set-username' || url === '/user/logout' ) {
    return next();
  }
  if ( !req.session.username ) {
    req.flash('info', 'You need to set your username');
    return res.redirect('/user/profile/set-username');
  }
  next();
};
