const path = require('path');
const rootPath = require('forthright48/world').rootPath;
const config = require('./config.js');
const changed = require('gulp-changed');

module.exports = function(gulp) {
  gulp.task('copy:src', function() {
    // Copy everything except css, scss and image
    return gulp.src(['./src/**', '!./src/**/*.css', '!./src/**/*.scss', `!${config.image}`])
      .pipe(changed(config.dirs.public))
      .pipe(gulp.dest(config.dirs.public));
  });

  gulp.task('copy:css_build', function() {
    return gulp.src('./css_build/**')
      .pipe(gulp.dest(config.dirs.public));
  });

  gulp.task('copy', gulp.parallel('copy:src', 'copy:css_build'));
};
