/** Display a form for each username not set*/
$('.setUserName').on('click', function(event) {
  const ojname = $(this).attr('data-ojname');
  $('#ojname').val(ojname);
  $('#setUserNameModal').modal('show');
});

$('.syncButton').click(function(event) {
  $('body').addClass('loadingModal');
});

$('#setUserNameModal form').on('keyup keypress', function(e) {
  const keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});

$('.checkUserId').click(function(event) {
  $('body').addClass('loadingModal');
  const ojname = $('#ojname').val();
  const userId = $('#userId').val();

  if ( !userId ) {
    alert('User Id cannot be blank');
    $('body').removeClass('loadingModal');
    return false;
  }

  $.ajax({
    url: `/gateway/ojscraper/userInfo/${ojname}/${userId}`,
  }).done(function(info) {
    if ( info.error ) {
      console.log(info.error);
      alert('Some error occured');
      $('body').removeClass('loadingModal');
      return false;
    }
    // eslint-disable-next-line max-len
    if ( confirm(`The user ${userId} has solved ${info.solveCount}. Is this you?`) ) {
      $('#setUserNameModal form').submit();
    }
    $('body').removeClass('loadingModal');
  });

  return false;
});
