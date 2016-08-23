const path = require('path');
const rootPath = require('forthright48/world').rootPath;
const config = require('./config.js');

module.exports = function(gulp) {
  gulp.task('copy:pdf', function() {
    return gulp.src('./src/**/*.pdf')
      .pipe(gulp.dest(config.path.dirs.public));
  });

  gulp.task('copy', gulp.parallel('copy:pdf'));
};
