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
  $('#platform').val(undefined);
  $('#pid').val('');

  const val = $('#link').val();

  const uvaRegExp = /^https?:\/\/uva\.onlinejudge\.org/gi;
  const cfRegExp = /^https?:\/\/codeforces\.com\/problemset\/problem\/([\d]*)\/([A-Z])/gi;
  const lojRegExp = /^https?:\/\/www\.lightoj\.com\/volume_showproblem\.php\?problem=([\d]{4,4})/gi;
  const spojRegExp = /^https?:\/\/www\.spoj\.com\/problems\/([\w]*)/gi;
  const hduRegExp = /^https?:\/\/acm\.hdu\.edu\.cn\/showproblem\.php\?pid=([\d]{4,4})/gi;
  const pojRegExp = /https?:\/\/poj\.org\/problem\?id=([\d]{4})/gi;

  let arr;
  if (arr = uvaRegExp.exec(val)) {
    $('#platform').val('UVa');
  } else if ( arr = cfRegExp.exec(val) ) {
    $('#platform').val('CF');
    $('#pid').val(arr[1]+arr[2]);
  } else if ( arr = lojRegExp.exec(val) ) {
    $('#platform').val('LOJ');
    $('#pid').val(arr[1]);
  } else if ( arr = spojRegExp.exec(val) ) {
    $('#platform').val('SPOJ');
    $('#pid').val(arr[1]);
  } else if ( arr = hduRegExp.exec(val) ) {
    $('#platform').val('HDU');
    $('#pid').val(arr[1]);
  } else if ( arr = pojRegExp.exec(val) ) {
    $('#platform').val('POJ');
    $('#pid').val(arr[1]);
  }
}
