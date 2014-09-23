var $window = $(window), $cube = $('.cube'), $face = $('.face'),
    faces = [];

['.one', '.two', '.three',
  '.four', '.five', '.six'].forEach(function (numberClass, idx) {
    faces['$' + (idx + 1)] = $face.filter(numberClass);
});

function tumbleCubeDesktop () {
  var vertiScroll = 0, horiScroll = 0,
      xAngle = 0, yAngle = 0, zAngle = 0, nowScrolling = false,
      isFlipped90 = false, isFlipped180 = false, isFacingDown = false;

  $window.on('mousewheel', function (e) {
    e.preventDefault();
    nowScrolling = true;

    xIncrement = e.deltaX * 0.2;
    yIncrement = e.deltaY * 0.2;

    if (isFacingDown) {
      zAngle -= xIncrement;
    } else if (isFlipped90) {
      zAngle += xIncrement;
    } else if (isFlipped180) {
      xAngle += xIncrement;
    } else if (isFacingDown) {
      zAngle -= xIncrement;
    } else {
      xAngle -= xIncrement;
    }

    yAngle -= yIncrement;

    $cube[0].style.webkitTransform = "rotateX(" + yAngle + "deg) rotateY(" + xAngle + "deg) rotateZ(" + zAngle + "deg)";
    $cube[0].style.MozTransform = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg) rotateZ(" + zAngle + "deg)";
  });

  setInterval(function () {
    var angleFrom90 = Math.abs(yAngle % 180 / 2),
        angleFrom180 = Math.abs(yAngle % 360 / 2),
        offsetFromBottom = Math.abs((yAngle - 90) / 180 % 2);

    if (!nowScrolling) {
      isFlipped90 = Math.abs(45 - angleFrom90) < 10;
      isFlipped180 = Math.abs(90 - angleFrom180) < 10;
      isFacingDown = Math.abs(offsetFromBottom - 1) < 0.2;
    }
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
      if (event.target.tagName == 'A') return;

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

if (isMobile()) {
  tumbleCubeMobile();
} else {
  tumbleCubeDesktop();
}

