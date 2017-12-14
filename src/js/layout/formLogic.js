/** Logics related to forms */

/* Prevent user from clicking submit button twice*/
function clickFactory() {
  const clickedItems = {};
  return function() {
    if (clickedItems[this]) return false;
    clickedItems[this] = true;
    $(this).addClass('disabled');
    return true;
  };
}
let currentClickFn = clickFactory();
function disableOnClick() {
  currentClickFn = clickFactory();
  $('.disableOnClick').on('click', currentClickFn);
};

disableOnClick();

$('form').on('input', function() {
  $('.disableOnClick').off('click', currentClickFn).removeClass('disabled');
  disableOnClick();
});
