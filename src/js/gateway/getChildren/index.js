const fill_view = require('js/layout/fill-view.js');
const ojscraper = require('ojscraper');

function main() {
  showFormParts();
  $('#type').change(showFormParts);
  $('#inlineForm').submit(handleSubmit);
}

main();

/*Implementation*/

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
  fill_view($);
}

function handleSubmit(event){
  const itemType = $('#type option:selected').val();

  if( itemType == 'folder' ) {
    return true;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  const ojname = $('#platform').val();
  const problemID = $('#pid').val();

  if ( !ojname || !problemID) {
    alert('platform or problem id cannot be blank')
    return false;
  }

  $('#wait').show();
  $('#showDetails').hide();
  $('#problemDetails').modal('show');

  ojscraper.getProblemInfo({ojname,problemID})
    .then(function(info){
      $('#wait').hide();
      $('#p-platform').val(ojname);
      $('#p-pid').val(problemID);
      $('#p-title').val(info.title);
      $('#p-link').val(info.link);
      $('#p-link2').attr('href', info.link)
      $('#showDetails').show();
      $('#addProblem').show();
    })
    .catch(function(err){
      console.log(err);
      $('#error').append(`<p>${err.message}</p>`);
      $('#wait').hide();
      $('#error').show();
    })
  return false;
}
