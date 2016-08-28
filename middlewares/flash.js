/*Responsible for inserting all flash messages to res.locals for rendering*/
/*One time use only*/

module.exports = function(req, res, next) {
  const flash = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warn'),
    error: req.flash('error')
  };
  res.locals.flash = JSON.stringify(flash);
  next();
};
