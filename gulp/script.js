const path = require('path');
const uglify = require('gulp-uglify');
const rootPath = require('forthright48/world').rootPath;
const rename = require('gulp-rename');
const browserify = require('browserify');
const glob = require('glob');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('./config.js');
const sourcemaps = require('gulp-sourcemaps');

const vendors = config.vendorInput.js;

module.exports = function(gulp) {
  gulp.task('build:vendor', function() {
    const b = browserify({
      debug: true,
      paths: config.browserifyPath,
    });

    // require all libs specified in vendors array
    vendors.forEach(function(lib) {
      let expose = lib;
      if (lib[0] === '.') {
        // Relative path
        expose = path.basename(lib, '.js');
      }

      b.require(lib, {
        expose,
      });
    });

    return b.bundle()
      .pipe(source('vendor.js'))
      .pipe(gulp.dest(config.vendorOutput.js))
      .pipe(rename({
        suffix: '.min',
      }))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(config.vendorOutput.js));
  });

  function browserified(filePath) {
    const fileName = path.basename(filePath);
    return browserify({
        entries: [filePath],
        paths: config.browserifyPath,
      })
      .external(vendors)
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
