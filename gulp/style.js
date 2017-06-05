const config = require('./config');
const sass = require('gulp-sass');
const absUrl = require('gulp-css-url-to-absolute');
const changed = require('gulp-changed');

const sassConfig = {
  outputStyle: 'compressed',
  sourceMapEmbed: true,
  includePaths: config.sassInclude,
};

module.exports = function(gulp) {
  // Changes all relative urls inside css file to absolute urls

  gulp.task('cssAbsPath:src', function() {
    return gulp.src(config.css.src, {
        nodir: true,
      })
      .pipe(changed(config.dirs.css_build))
      .pipe(absUrl({
        root: './src',
      }))
      .pipe(gulp.dest(config.dirs.css_build));
  });

  gulp.task('cssAbsPath:client_module', function() {
    return gulp.src(config.css.client_module, {
        nodir: true,
      })
      .pipe(changed(config.dirs.css_build))
      .pipe(absUrl({
        root: './client_module',
      }))
      .pipe(gulp.dest(config.dirs.css_build));
  });

  gulp.task('build:css',
    gulp.parallel('cssAbsPath:src', 'cssAbsPath:client_module'
  ));

  gulp.task('style:scss', gulp.series(function() {
    return gulp.src(config.scss)
      .pipe(sass.sync(sassConfig).on('error', sass.logError))
      .pipe(gulp.dest(config.dirs.public));
  }));
};
