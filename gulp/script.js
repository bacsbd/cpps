const path = require('path');
const uglify = require('gulp-uglify');
const rootPath = path.join(__dirname, '../');
const rename = require('gulp-rename');
const browserify = require('browserify');
const glob = require('glob');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('./config.js');
const sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp) {
  function browserified(filePath) {
    const fileName = path.basename(filePath);
    return browserify({
        entries: [filePath],
        paths: config.browserifyPath,
      })
      .transform('babelify', {
        presets: ['es2015'],
      })
      .bundle()
      .on('error', function(err) {
        // print the error (can replace with gulp-util)
        console.log(err.message);
        // end this stream
        this.emit('end');
      })
      .pipe(source(fileName));
  }

  gulp.task('script', function(done) {
    const filePathArray = glob.sync('./src/js/**/*.js');
    filePathArray.forEach(function(filePath) {
      let destPath = path.relative(path.join(rootPath, 'src'), filePath);
      destPath = path.join('./public', destPath);
      const destDir = path.dirname(destPath);

      // Get Modified Time
      /* const mtimeSource = fs.statSync(path.join(rootPath, filePath)).mtime;
      let mtimeDest;
      try {
        mtimeDest = fs.statSync(path.join(rootPath, destPath)).mtime;
      } catch (e) {
        mtimeDest = mtimeSource;
      }

      if (mtimeSource < mtimeDest) return;*/

      browserified(filePath)
        .pipe(gulp.dest(destDir))
        .pipe(rename({
          suffix: '.min',
        }))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .on('error', function(err) {
          // print the error (can replace with gulp-util)
          console.log(err.message);
          // end this stream
          this.emit('end');
        })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destDir));
    });
    done();
  });
};
