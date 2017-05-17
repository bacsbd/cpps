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

/*Prevent user from clicking submit button twice*/
$('.disableOnClick').on('click', (function() {
  const clickedItems = {};
  return function() {
    if (clickedItems[this]) return false;
    clickedItems[this] = true;
    $(this).addClass('disabled');
    return true;
  };
}()));
