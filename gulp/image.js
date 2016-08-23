const imagemin = require('gulp-imagemin');
const config = require('./config.js');

module.exports = function(gulp) {
  gulp.task('image', () =>
    gulp.src(config.path.image)
    .pipe(imagemin())
    .pipe(gulp.dest(config.path.dirs.output))
  );
};
