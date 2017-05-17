const $ = require('jquery');
const fill_view = require('js/layout/fill-view.js');

function main() {
  hideEverything();
  fill_view($);
  showFormParts();

  $('#type').change(showFormParts);
}

main();

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
  fill_view($);
}
