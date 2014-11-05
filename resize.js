var $cube = $('.cube'), $window = $(window);

function resize(event) {
  var $face = $('.face'), faces = {};

  ['.one', '.two', '.three',
    '.four', '.five', '.six'].forEach(function (numberClass, idx) {
      faces['$' + (idx + 1)] = $face.filter(numberClass);
  });

  var edgeLength = 360,
      halfLength = edgeLength / 2,
      quarterLength = halfLength / 2,
      topMargin= ($window.height() - edgeLength) * 0.5;

  $cube.css('margin-top', topMargin + 'px');
  $cube.css('height', edgeLength + 'px');
  $face.css('height', edgeLength + 'px');
  $cube.css('width', edgeLength + 'px');

  faces.$1.css('-webkit-transform',
      'rotateX(' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');
  faces.$1.css('transform',
      'rotateX(' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');

  faces.$2.css('-webkit-transform',
      'translateZ(' + halfLength + 'px)');
  faces.$2.css('transform',
      'translateZ(' + halfLength + 'px)');

  faces.$3.css('-webkit-transform',
     'rotateY(' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');
  faces.$3.css('transform',
     'rotateY(' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');

  faces.$4.css('-webkit-transform',
      'rotateY(' + halfLength + 'deg) translateZ(' + halfLength + 'px)');
  faces.$4.css('transform',
      'rotateY(' + halfLength + 'deg) translateZ(' + halfLength + 'px)');

  faces.$5.css('-webkit-transform',
      'rotateY(-' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');
  faces.$5.css('transform',
      'rotateY(-' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');

  faces.$6.css('-webkit-transform',
      'rotateX(-' + quarterLength + 'deg) translateZ(' + halfLength +
        'px) rotate(' + halfLength + 'deg)');
  faces.$6.css('transform',
      'rotateX(-' + quarterLength + 'deg) translateZ(' + halfLength +
        'px) rotate(' + halfLength + 'deg)');
}

resize();
$window.on('resize', resize);

