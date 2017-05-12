const $ = require('jquery');
const marked = require('marked');
const escapeLatex = require('forthright48/escapeLatex');

$('#previewButton').click(previewTextArea);

function previewTextArea() {
  const text = escapeLatex($('textarea').val());
  marked(text, function(err, html) {
    if (err) return alert('Some error occured');
    $('#previewBody').append(html);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "previewBody"]);
  });
}
