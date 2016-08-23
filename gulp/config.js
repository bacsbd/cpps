module.exports = {
  path: {
    dirs: {
      public: './public',
      temp: './temp',
      output: './public'
    },
    pug: './views/**/*.pug',
    image: './src/**/*.{JPG,jpg,png,gif}',
    css: [
      './node_modules/@forthright48/simplecss/dist/*.css',
      './src/**/*.css'
    ],
    js: './src/**/*.js',
    pdf: './src/**/*.pdf',
    vendor: {
      js: './src/js/vendors'
    },
    browsersync: ['./public/**/*.css', './public/**/*.js', 'views/**/*.pug']
  },
  vendors: []
};
