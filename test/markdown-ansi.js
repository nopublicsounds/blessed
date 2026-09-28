var assert = require('assert');
var stream = require('stream');
var blessed = require('../');

var input = new stream.PassThrough();
var output = new stream.PassThrough();

input.isTTY = true;
input.setRawMode = function() {};
output.columns = 12;
output.rows = 8;

var screen = blessed.screen({
  input: input,
  output: output,
  terminal: 'xterm-256color',
  fullUnicode: true,
  forceUnicode: true,
  trueColor: true
});
var box = blessed.box({
  parent: screen,
  width: 8,
  height: 3,
  content: '\x1b[38;2;255;0;0m가나다라마바사\x1b[0m'
});

screen.render();

assert.deepStrictEqual(
  box._clines.map(function(line) {
    return box.strWidth(line.replace(/\x1b\[[\d;]*m/g, ''));
  }),
  [8, 6]
);
assert.strictEqual(box._clines[1][0], '마');
assert.deepStrictEqual(
  (box.screenshot().match(/\x1b\[38;2;255;0;0m/g) || []).length,
  2
);

screen.destroy();
