var $window = $(window), $cube = $('.cube'), $face = $('.face');

var vertiScrolling = 0, horiScrolling = 0, lastScrollTop = 0, lastScrollLeft = 0;

$window.on('scroll', tumbleCube);
$window.on('resize', resize);

function tumbleCube () {
  var distanceToTop = $window.scrollTop();
  var distanceToLeft = $window.scrollLeft();

  if (distanceToTop > lastScrollTop && $window.scrollTop() > 0) {
    vertiScrolling = vertiScrolling + 7;
  } else if (distanceToTop < lastScrollTop && $window.scrollTop() < 0) {
    vertiScrolling = vertiScrolling - 7;
  }

  if (distanceToLeft > lastScrollLeft && $window.scrollLeft() > 0) {
    horiScrolling = horiScrolling + 7;
  } else if (distanceToLeft < lastScrollLeft && $window.scrollLeft() < 0) {
    horiScrolling = horiScrolling - 7;
  }

  $cube[0].style.webkitTransform = "rotateX("+ vertiScrolling +"deg) rotateY("+ -horiScrolling +"deg)";
  $cube[0].style.MozTransform = "rotateX("+ vertiScrolling +"deg) rotateY("+ -horiScrolling +"deg)";
}

var edgeLength = 360,
    faces = [];

    ['.one', '.two', '.three',
      '.four', '.five', '.six'].forEach(function (numberClass, idx) {
      faces['$' + (idx + 1)] = $face.filter(numberClass);
    });

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

if (isMobile()) {
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

function isMobile () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent);
}

$(document).ready(resize);

