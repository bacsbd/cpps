const cleanCSS = require('gulp-clean-css');
const config = require('./config');
const sass = require('gulp-sass');
const absUrl = require('gulp-css-url-to-absolute');
const changed = require('gulp-changed');

const sassConfig = {
  includePaths: config.sassInclude,
  outputStyle: 'compressed'
};

module.exports = function(gulp) {
  //Changes all relative urls inside css file to absolute urls
  gulp.task('build:css', function() {
    return gulp.src(config.css)
      .pipe(changed(config.dirs.css_build))
      .pipe(absUrl({
        root: './src'
      }))
      .pipe(gulp.dest(config.dirs.css_build));
  });

  gulp.task('style:scss', function() {
    return gulp.src(config.scss)
      .pipe(sass.sync(sassConfig).on('error', sass.logError))
      .pipe(gulp.dest(config.dirs.public));
  });
};
