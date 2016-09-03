const $ = require('jquery');
const notify = require('notifyjs-browser')(this, $);
require('jquery-modal');
const moment = require('moment');

/*Add flash messages*/
require('./flash')($);

$('.moment-date').each(function() {
  let date = $(this).html();
  date = moment(date, 'ddd MMM DD YYYY HH:mm:ss ZZ').fromNow();
  $(this).html(date);
});
