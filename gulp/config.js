module.exports = {
  dirs: {
    public: './public',
    temp: './temp',
    output: './public',
    css_build: './css_build',
  },
  pug: './views/**/*.pug',
  css: {
    src: './src/**/*.css',
    all: ['./src/**/*.css'],
  },
  scss: './src/**/*.scss',
  js: './src/**/*.js',
  pdf: './src/**/*.pdf',
  vendorOutput: {
    js: './public/js/vendor',
    css: './public/css/vendor',
  },
  browsersync: ['./views/**/*.pug'],
  sassInclude: ['./public'],
  browserifyPath: ['./node_modules', './src', './server/node_modules'],
};
