/**
 * Pass session variables to jade context
 */

module.exports = function(req, res, next) {
  if ( req.session.login ) {
    res.locals.login = true;
    res.locals.email = req.session.email;
    res.locals.status = req.session.status;
    res.locals.superUser = req.session.status !== 'user';
    res.locals.username = req.session.username;
  }
  next();
};
