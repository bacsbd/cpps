module.exports = {
  dirs: {
    public: './public',
    temp: './temp',
    output: './public',
    css_build: './css_build',
    client_module: './client_module',
  },
  pug: './views/**/*.pug',
  image: './src/**/*.{JPG,jpg,png,gif}',
  css: {
    src: './src/**/*.css',
    client_module: './client_module/**/*.css',
    all: ['./src/**/*.css', './client_module/**/*.css'],
  },
  scss: './src/**/*.scss',
  js: './src/**/*.js',
  pdf: './src/**/*.pdf',
  vendorOutput: {
    js: './public/js/vendor',
    css: './public/css/vendor',
  },
  browsersync: ['./public/**', './views/**/*.pug'],
  sassInclude: ['./public'],
  vendorInput: {
    js: [],
    css: [],
    all: [],
  },
  browserifyPath: ['./node_modules', './src'],
};
