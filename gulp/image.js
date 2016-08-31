const imagemin = require('gulp-imagemin');
const config = require('./config.js');

module.exports = function(gulp) {
  gulp.task('image', function() {
    return gulp.src(config.image)
      .pipe(imagemin())
      .pipe(gulp.dest(config.dirs.public));
  });
};
