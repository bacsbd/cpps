/*Responsible for inserting all flash messages to res.locals for rendering*/

module.exports = function(app) {
  app.use(function(req, res, next) {
    const flash = {
      info: req.flash('info'),
      success: req.flash('success'),
      warning: req.flash('warning'),
      error: req.flash('error')
    };
    res.locals.flash = flash;
    next();
  });
};
