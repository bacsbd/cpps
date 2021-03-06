const fillView = require('js/layout/fill-view.js');

function main() {
  showFormParts();
  $('#type').change(showFormParts);
  $('#inlineForm').submit(handleSubmit);
}

main();

/* Implementation*/

function hideEverything() {
  $('.folder, .problem').hide();
}

function showFormParts() {
  hideEverything();

  const val = $('#type option:selected').val();

  if (val === 'problem') {
    $('.problem').show();
  } else if (val === 'folder') {
    $('.folder').show();
  }
  fillView($);
}

function handleSubmit(event) {
  $('.d-hide').hide();

  const itemType = $('#type option:selected').val();

  if( itemType == 'folder' ) {
    const lastIndex = parseInt($('.indexNumber').last().text());
    $('#ind').val(lastIndex? lastIndex+1: 1);
    return true;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  const ojname = $('#platform').val();
  const problemID = $('#pid').val();

  if ( !ojname || !problemID) {
    alert('platform or problem id cannot be blank');
    return false;
  }

  $('#wait').show();
  $('#problemDetails').modal('show');

  $.ajax({
    url: `/gateway/ojscraper/problemInfo/${ojname}/${problemID}`,
  }).done(function(info) {
    if ( info.error ) {
      console.log(info.error);
      $('#error').html(`<p>${info.error.message}</p>`);
      $('#wait').hide();
      $('#error').show();
      return;
    }
    $('#wait').hide();
    const lastIndex = parseInt($('.indexNumber').last().text());
    $('#p-index').val(lastIndex? lastIndex+1: 1);
    $('#p-platform').val(ojname);
    $('#p-pid').val(problemID);
    $('#p-title').val(info.title);
    $('#p-link').val(info.link);
    $('#p-link2').attr('href', info.link);
    $('#showDetails').show();
    $('#addProblem').show();
  });
  return false;
}
