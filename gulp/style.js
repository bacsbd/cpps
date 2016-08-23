const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const config = require('./config');

module.exports = function(gulp) {
  gulp.task('style', function() {
    return gulp.src(config.path.css)
      .pipe(cleanCSS())
      .pipe(concat('all.css'))
      .pipe(gulp.dest('./public/css'));
  });
};
