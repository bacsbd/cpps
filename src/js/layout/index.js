const $ = require('jquery');
window.jQuery = window.$ = $;

const notify = require('notifyjs-browser')(this, $);
const moment = require('moment');

const tether = require('tether');
window.Tether = tether;

const bootstrap = require('vendor/bootstrap/js/bootstrap.js');


/*Add flash messages*/
require('./flash')($);

require('./fill-view')($);

$('.moment-date').each(function() {
  let date = $(this).html();
  date = moment(date, 'ddd MMM DD YYYY HH:mm:ss ZZ').fromNow();
  $(this).html(date);
});

// For popover
$(function () {
  $('[data-toggle="popover"]').popover()
});
$('.popover-dismiss').popover({
  trigger: 'focus'
})

require('./formLogic');
