/*Add flash messages*/
require('./flash')($);

require('./fill-view')($);

$('.moment-date').each(function() {
  let date = new Date($(this).text());
  date = moment(date).fromNow();
  $(this).html(date);
});

// For popover
$(function () {
  $('[data-toggle="popover"]').popover()
});
$('.popover-dismiss').popover({
  trigger: 'focus'
})

// Hide all elements with d-hide class
$('.d-hide').hide();

require('./formLogic');
