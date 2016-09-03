const $ = require('jquery');


function hideEverything() {
  $('input[type="submit"], #body, #problem').hide();
}

hideEverything();

$('select').change(function() {
  hideEverything();

  const val = $('select option:selected').val();

  if (val === 'problem') {
    $('#problem, #body').show();
  } else if (val === 'text') {
    $('#body').show();
  }
  $('input[type="submit"]').show();
});
