const config = require('./config.js');
const changed = require('gulp-changed');

module.exports = function(gulp) {
  function copyRest(folder) {
    // Copy everything except css, scss, js and image
    // Unless it is in vendor folder
    return gulp.src(
        [`./${folder}/**`,
          `!./${folder}/**/*.{css,scss,JPG,jpg,png,gif,js}`,
        ])
      .pipe(changed(config.dirs.public))
      .pipe(gulp.dest(config.dirs.public));
  }

  gulp.task('copy:src', function() {
    return copyRest('src');
  });

  gulp.task('copy:client_module', function() {
    return copyRest('client_module');
  });

  gulp.task('copy:css_build', function() {
    return gulp.src('./css_build/**')
      .pipe(changed(config.dirs.public))
      .pipe(gulp.dest(config.dirs.public));
  });

  gulp.task('client_module', function() {
    const x = `./node_modules/{${config.vendorInput.all.join(',')}}/**`;
    return gulp.src(x)
      .pipe(gulp.dest(config.dirs.client_module));
  });

  gulp.task(
    'copy',
    gulp.parallel('copy:src', 'copy:client_module', 'copy:css_build'
  ));
};
