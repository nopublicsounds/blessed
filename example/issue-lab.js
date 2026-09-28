var blessed = require('../');
var unicode = require('../lib/unicode');

var screen = blessed.screen({
  smartCSR: true,
  title: 'blessed issue lab',
  fullUnicode: true,
  forceUnicode: true,
  trueColor: true
});

var status = blessed.box({
  parent: screen,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 3,
  border: 'line',
  tags: true,
  content: ' {bold}Ready.{/bold} Tab switches textboxes; e adds an emoji line;'
    + ' x opens a shell; q quits.'
});

function setStatus(text) {
  status.setContent(' ' + text);
  screen.render();
}

var inputPanel = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '50%',
  height: 9,
  border: 'line',
  label: ' #406 inputOnFocus '
});

var first = blessed.textbox({
  parent: inputPanel,
  inputOnFocus: true,
  mouse: true,
  top: 1,
  left: 1,
  right: 1,
  height: 3,
  border: 'line',
  label: ' first '
});

var second = blessed.textbox({
  parent: inputPanel,
  inputOnFocus: true,
  mouse: true,
  top: 4,
  left: 1,
  right: 1,
  height: 3,
  border: 'line',
  label: ' second '
});

first.on('focus', function() {
  setStatus('{green-fg}#406{/green-fg}: first textbox has focus.');
});

second.on('focus', function() {
  setStatus('{green-fg}#406{/green-fg}: second textbox has focus. Type here'
    + ' after switching to confirm input is not duplicated.');
});

var emojiLog = blessed.log({
  parent: screen,
  top: 9,
  left: 0,
  bottom: 3,
  width: '50%',
  border: 'line',
  label: ' #422 pushLine emoji width '
});

function addEmojiLine() {
  var width = unicode.strWidth('🐢');
  emojiLog.pushLine('Test 🐢 | measured width: ' + width + ' cell(s)');
  setStatus('{yellow-fg}#422{/yellow-fg}: added an emoji via pushLine();'
    + ' inspect the right box border.');
}

addEmojiLine();

var colorPanel = blessed.box({
  parent: screen,
  top: 0,
  left: '50%',
  width: '50%',
  height: 9,
  border: 'line',
  label: ' #451 truecolor '
});

var shades = [
  '#1d3557', '#457b9d', '#a8dadc', '#f1faee',
  '#e63946', '#ff9f1c', '#2ec4b6', '#8338ec'
];

shades.forEach(function(shade, index) {
  blessed.box({
    parent: colorPanel,
    top: 1,
    left: index * 12 + '%',
    width: '13%',
    height: 3,
    style: { bg: shade }
  });
});

var color = colorPanel.sattr({ fg: '#123456' });
colorPanel.setContent(
  'Requested RGB: #123456\n'
  + 'Output SGR: ' + JSON.stringify(screen.codeAttr(color))
);

var execPanel = blessed.box({
  parent: screen,
  top: 9,
  left: '50%',
  bottom: 3,
  width: '50%',
  border: 'line',
  label: ' #358 mouse during screen.exec ',
  tags: true
});

execPanel.setContent(
  'Press {bold}x{/bold} to launch your shell.\n\n'
  + 'Move or scroll the mouse in that shell. Mouse escape sequences must not'
  + ' appear in its input. Type {bold}exit{/bold} to return here.\n\n'
  + 'Blessed disables and restores mouse reporting'
  + ' around a child process.'
);

screen.key(['tab'], function() {
  screen.focusNext();
  screen.render();
});

screen.key(['e'], addEmojiLine);

screen.key(['x'], function() {
  setStatus('{cyan-fg}#358{/cyan-fg}: shell started; test mouse movement'
    + ' and exit to return.');
  screen.exec(process.env.SHELL || 'sh', [], {}, function(err) {
    setStatus(err
      ? '{red-fg}#358{/red-fg}: shell could not start: ' + err.message
      : '{green-fg}#358{/green-fg}: shell exited; UI restored.');
  });
});

screen.key(['escape', 'q', 'C-c'], function() {
  screen.destroy();
});

first.focus();
screen.render();
