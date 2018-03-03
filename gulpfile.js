const gulp = require('gulp');

require('./gulp/server.js')(gulp);
require('./gulp/util.js')(gulp);
require('./gulp/style.js')(gulp);
require('./gulp/copy.js')(gulp);
require('./gulp/script.js')(gulp);
require('./gulp/watch.js')(gulp);


gulp.task('default',
  gulp.series(
    'clean',
    'build:css',
    'copy',
    gulp.parallel('style:scss', 'script'),
    gulp.parallel('watch', 'browser-sync')
  )
);

gulp.task('production',
  gulp.series(
    'clean',
    'build:css',
    'copy',
    gulp.parallel('style:scss', 'script')
  )
);
