module.exports = {
  dirs: {
    public: './public',
    temp: './temp',
    output: './public',
    css_build: './css_build'
  },
  pug: './views/**/*.pug',
  image: './src/**/*.{JPG,jpg,png,gif}',
  css: './src/**/*.css',
  scss: './src/**/*.scss',
  js: './src/**/*.js',
  pdf: './src/**/*.pdf',
  vendorOutput: {
    js: './public/js/vendor',
    css: './public/css/vendor'
  },
  browsersync: ['./public/**', './views/**/*.pug'],
  sassInclude: ['./public', './node_modules'],
  vendorInput: {
    js: ['jquery', 'notifyjs-browser', 'jquery-modal'],
    css: ['./node_modules/jquery-modal/jquery-modal.css']
  },
  browserifyPath: ['./node_modules', './src/js/']
};
