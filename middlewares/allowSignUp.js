/** Middleware that controls whether user Sign Up is allowed or not
 *
 * If process.env.NO_SIGN_UP is defined, then registration is switched off
 */
module.exports = function(req, res, next) {
  //if (process.env.NO_SIGN_UP === "1") {
  if (true) { // TODO: create configuration file
    req.flash("info", "Sign up is currently switched off. You need an invitation.");
    return res.redirect("/");
  }
  next();
}
