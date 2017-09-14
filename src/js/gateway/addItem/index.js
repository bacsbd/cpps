const $ = require('jquery');
const fill_view = require('js/layout/fill-view.js');

function main() {
  hideEverything();
  fill_view($);
  showFormParts();

  $('#type').change(showFormParts);

  $('#link').on('paste', function(){
    setTimeout(autoFillFromLink,0)
  });
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

function autoFillFromLink(){
  const val = $('#link').val();

  const uvaRegExp = RegExp("^https?://uva.onlinejudge.org", "gi");
  const cfRegExp = RegExp("^https?://codeforces.com/problemset/problem/([\\d]*)/([A-Z])", "gi");

  let arr;
  if (arr = uvaRegExp.exec(val)) {
    $('select').val('UVa');
  } else if ( arr = cfRegExp.exec(val) ) {
    $('select').val('CF');
    console.log(arr, arr[1], arr[2]);
    $('#pid').val(arr[1]+arr[2]);
  }
}
