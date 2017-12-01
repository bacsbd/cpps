const mongoose = require('mongoose');
const dburl = require('world').secretModule.dburl;

mongoose.Promise = global.Promise;
mongoose.connect(dburl, function(err) {
  if (err) console.log(err);
  else console.log('Successfully connected to database');
});
