var assert = require('assert');
var stream = require('stream');

process.env.FORCE_COLOR = '3';

var gradient = require('gradient-string');
var blessed = require('../');

var input = new stream.PassThrough();
var output = new stream.PassThrough();

input.isTTY = true;
input.setRawMode = function() {};
output.columns = 80;
output.rows = 24;

var value = gradient(['#ff0000', '#0000ff'])('gradient-string');
var screen = blessed.screen({
  input: input,
  output: output,
  terminal: 'xterm-256color',
  trueColor: true
});
var box = blessed.box({
  parent: screen,
  width: '100%',
  height: 1,
  content: value
});

assert.ok(/\x1b\[38;2;\d+;\d+;\d+m/.test(value));

screen.render();

assert.ok(/\x1b\[38;2;255;0;0m/.test(box.screenshot()));
assert.ok(/\x1b\[38;2;0;0;255m/.test(box.screenshot()));

screen.destroy();
