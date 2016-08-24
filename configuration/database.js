const mongoose = require('mongoose');
const dburl = require('../secret.js').dburl;

mongoose.connect(dburl, function(err) {
  if (err) console.log(err);
  else console.log('Successfully connected to database');
});
