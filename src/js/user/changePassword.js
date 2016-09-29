require('jquery-validation');

$('form').validate({
  rules: {
    repeat: {
      equalTo: '#new'
    }
  },
  messages: {
    repeat: {
      equalTo: 'Must match with new password'
    }
  },
  errorClass: 'alert alert-danger'
});
