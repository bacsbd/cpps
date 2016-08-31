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
    js: './public/js/vendors',
    css: './public/css/vendors'
  },
  browsersync: ['./public/**/*.css', './public/**/*.js', './views/**/*.pug'],
  sassInclude: ['./public', './bower_components'],
  vendorInput: {
    js: ['jquery', 'notifyjs-browser'],
    css: []
  },
  browserifyPath: ['./node_modules', './src/js/']
};
