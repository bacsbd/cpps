/** Middleware that controls whether user Sign Up is allowed or not
 *
 * Signup is controlled by "invite_only" settings value
 */
const settings = require('../controllers/node_modules/settings');
module.exports = function(req, res, next) {
  if (settings.getKey('invite_only') === "on") {
    req.flash("info", "Sign up is currently switched off. You need an invitation.");
    return res.redirect("/");
  }
  next();
}
