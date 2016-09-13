module.exports = function($) {
  const windowHeight = $(window).height();
  const htmlHeight = $('html').height();

  const fillView = $('#fill-view').height();
  if (htmlHeight + 5 < windowHeight) {
    const dif = windowHeight - htmlHeight;
    $('#fill-view').animate({
      "min-height": fillView + dif
    }, 300);
  }
};
