const $ = require('jquery');
const notify = require('notifyjs-browser')(this, $);

$.notify.defaults({
  autoHideDelay: 15000
});

for (const val in flash) {
  const len = flash[val].length;
  for (let i = 0; i < len; i++) {
    $.notify(flash[val][i], val);
  }
}
