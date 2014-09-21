var $window = $(window), $cube = $('.cube'), $face = $('.face'),
    faces = [];

['.one', '.two', '.three',
  '.four', '.five', '.six'].forEach(function (numberClass, idx) {
    faces['$' + (idx + 1)] = $face.filter(numberClass);
});

if (isMobile()) {
  tumbleCubeMobile();
} else {
  tumbleCubeDesktop();
}

function tumbleCubeDesktop () {
  var vertiScrolling = 0, horiScrolling = 0,
      nowScrolling = false, flipped90 = false, flipped180 = false;

  $window.on('mousewheel', function (e) {
    e.preventDefault();
    nowScrolling = true;

    horiScrolling -= e.deltaX * 0.5;
    vertiScrolling -= e.deltaY * 0.5;
  });

  setInterval(function () {
    var angleFrom90 = Math.abs(vertiScrolling % 180 / 2);
    var angleFrom180 = Math.abs(vertiScrolling % 360 / 2);

    if (!nowScrolling) flipped90 = Math.abs(45 - angleFrom90) < 20;
    if (!nowScrolling) flipped180 = Math.abs(90 - angleFrom180) < 20;

    $cube[0].style.webkitTransform = "rotateX(" + vertiScrolling + "deg) rotateY(" + horiScrolling + "deg)";
    $cube[0].style.MozTransform = "rotateX(" + vertiScrolling + "deg) rotateY(" + horiScrolling + "deg)";
  }, 10);

  setInterval(function () {
    nowScrolling = false;
  }, 250);
}

function tumbleCubeMobile () {
  var vx = 0, vy = 0;
  var px = 0, py = 0;
  var lastx, lasty;

  document.addEventListener('touchstart', function(event) {
      event.preventDefault();
      var touch = event.touches[0];
      lastx = touch.pageX;
      lasty = touch.pageY;
  }, false);

  document.addEventListener('touchmove', function(event) {
      event.preventDefault();
      var touch = event.touches[0];
      var mousex = touch.pageX;
      var mousey = touch.pageY;
      if (lastx !== mousex) vx = mousex - lastx;
      if (lasty !== mousey) vy = mousey - lasty;
      lastx = mousex;
      lasty = mousey;
      isMoving = true;
  }, false);

  document.addEventListener('touchend', function(event) {
    event.preventDefault();
    isMoving = false;
  }, false);

  function render() {
    px -= vy;
    py += vx;
    vx *= 0.1;
    vy *= 0.1;
    $('.cube')[0].style.webkitTransform = "rotateX(" + px + "deg) rotateY(" + py + "deg)";
  }

  setInterval(render, 50);
}

$window.on('resize', resize);

function resize(event) {
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

function isMobile () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent);
}

$(document).ready(resize);

