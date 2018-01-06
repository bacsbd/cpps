const gulp = require('gulp');

require('./gulp/server.js')(gulp);
require('./gulp/util.js')(gulp);
require('./gulp/style.js')(gulp);
require('./gulp/copy.js')(gulp);
require('./gulp/script.js')(gulp);
require('./gulp/watch.js')(gulp);


gulp.task('default',
  gulp.series(
    gulp.parallel('clean'),
    'build:css',
    gulp.parallel('copy'),
    gulp.parallel('style:scss', 'script'),
    gulp.parallel('watch', 'browser-sync')
  )
);

gulp.task('production',
  gulp.series(
    gulp.parallel('clean'),
    'build:css',
    gulp.parallel('copy'),
    gulp.parallel('style:scss', 'script')
  )
);
