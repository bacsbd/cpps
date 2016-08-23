const del = require('del');
const config = require('./config.js');

module.exports = function(gulp) {
  gulp.task('clean', function(cb) {
    return del([config.path.dirs.public, config.path.dirs.temp, config.path.vendor.js], cb);
  });
};
