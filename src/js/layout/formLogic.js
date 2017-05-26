/** Logics related to forms
*/
/*Prevent user from clicking submit button twice*/
function disableOnClick(){
  $('.disableOnClick').on('click', (function() {
    const clickedItems = {};
    return function() {
      if (clickedItems[this]) return false;
      clickedItems[this] = true;
      $(this).addClass('disabled');
      return true;
    };
  }()));
};

disableOnClick();

$('form').on('input',function(){
  $('.disableOnClick').off('click').removeClass('disabled');
  disableOnClick();
})
