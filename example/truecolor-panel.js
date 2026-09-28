var blessed = require('../');

var screen = blessed.screen({
  smartCSR: true,
  title: 'blessed 24-bit color panel',
  trueColor: true
});

var levels = [0, 51, 102, 153, 204, 255];

function hex(value) {
  value = value.toString(16);
  return value.length === 1 ? '0' + value : value;
}

blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  border: 'line',
  align: 'center',
  content: '24-bit RGB gamut: 6 red x 6 green x 6 blue = 216 colors\n'
    + 'Each panel fixes blue; rows increase red and columns increase green.'
});

levels.forEach(function(blue, blueIndex) {
  var panel = blessed.box({
    parent: screen,
    top: blueIndex < 3 ? 3 : '50%+1',
    left: (blueIndex % 3) * 33 + '%',
    width: '34%',
    height: blueIndex < 3 ? '50%-4' : '50%-2',
    border: 'line',
    label: ' B=' + hex(blue).toUpperCase() + ' '
  });

  levels.forEach(function(red, redIndex) {
    levels.forEach(function(green, greenIndex) {
      var color = '#' + hex(red) + hex(green) + hex(blue);

      blessed.box({
        parent: panel,
        top: redIndex * 16 + '%',
        left: greenIndex * 16 + '%',
        width: '17%',
        height: '17%',
        style: { bg: color }
      });
    });
  });
});

screen.key(['escape', 'q', 'C-c'], function() {
  screen.destroy();
});

screen.render();
