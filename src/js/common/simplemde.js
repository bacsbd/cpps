const $ = require('jquery');
const marked = require('marked');
const escapeLatex = require('forthright48/escapeLatex');

const simplemde = new SimpleMDE({
  element: $(".simplemde")[0],
  previewRender: function(plainText, preview) { // Async method
    const text = escapeLatex(plainText);
    return marked(text);
	}
});

//setup before functions
let typingTimer;                //timer identifier
let doneTypingInterval = 1000;  //time in ms, 5 second for example
const $input = $('.CodeMirror');

//on keyup, start the countdown
$input.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown
$input.on('keydown', function () {
  clearTimeout(typingTimer);
});

//user is "finished typing," do something
function doneTyping () {
  MathJax.Hub.Typeset();
}
