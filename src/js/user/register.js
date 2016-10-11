require('jquery-validation');

$('form').validate({
  rules: {
    repass: {
      equalTo: '#password'
    }
  },
  messages: {
    repass: {
      equalTo: 'Must match with password typed above'
    }
  },
  errorClass: 'alert alert-danger'
});
