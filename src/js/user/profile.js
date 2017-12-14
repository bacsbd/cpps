/** Display a form for each username not set*/
$('.setUserName').on('click', function(event) {
  const ojname = $(this).attr('data-ojname');
  $('#ojname').val(ojname);
  $('#setUserNameModal').modal('show');
});

$('.syncButton').click(function(event) {
  $('body').addClass('loadingModal');
});
