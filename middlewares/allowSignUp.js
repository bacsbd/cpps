/** Middleware that controls whether user Sign Up is allowed or not
 *
 * If process.env.NO_SIGN_UP is defined, then registration is switched off
 */
module.exports = function(req, res, next) {
  if (process.env.NO_SIGN_UP) {
    req.flash("info", "Sign up is currently switched off");
    return res.redirect("/");
  }
  next();
}
