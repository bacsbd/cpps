const $ = require('jquery');

hideEverything();
showFormParts();

$('#type').change(showFormParts);

/*Implementation*/

function hideEverything() {
  $('input[type="submit"], #body, #problem').hide();
}

function showFormParts() {
  hideEverything();

  const val = $('select option:selected').val();

  if (val === 'problem') {
    $('#problem, #body').show();
  } else if (val === 'text') {
    $('#body').show();
  }
  $('input[type="submit"]').show();
}
