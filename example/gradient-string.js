process.env.FORCE_COLOR = '3';

var gradient = require('gradient-string');
var blessed = require('../');

var screen = blessed.screen({
  smartCSR: true,
  title: 'blessed gradient-string demo',
  trueColor: true
});

var title = gradient(['#ff0000', '#ff00ff', '#0000ff'])(
  'gradient-string -> blessed truecolor'
);
var sample = gradient(['#00ffff', '#00ff00', '#ffff00', '#ff0000'])(
  'The ANSI gradient below is parsed and rendered by Blessed.'
);

blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '90%',
  height: 9,
  border: 'line',
  align: 'center',
  valign: 'middle',
  content: title + '\n\n' + sample + '\n\nPress q, Esc, or Ctrl-C to exit.'
});

screen.key(['escape', 'q', 'C-c'], function() {
  screen.destroy();
});

screen.render();
