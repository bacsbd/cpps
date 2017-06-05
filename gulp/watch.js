const config = require('./config.js');

module.exports = function(gulp) {
  gulp.task('watch:scss', function() {
    return gulp.watch(config.scss, gulp.series('style:scss'));
  });
  gulp.task('watch:css', function() {
    return gulp.watch(
      config.css.all, gulp.series('build:css', 'copy:css_build', 'style:scss'
    ));
  });
  gulp.task('watch:js', function() {
    return gulp.watch(config.js, gulp.series('script'));
  });
  gulp.task('watch:image', function() {
    return gulp.watch(config.image, gulp.series('image'));
  });

  gulp.task(
    'watch', gulp.parallel('watch:css', 'watch:scss', 'watch:js', 'watch:image'
  ));
};
