var $window = $(window), $cube = $('.cube'), $face = $('.face');

var vertiScrolling = 0, horiScrolling = 0, lastScrollTop = 0, lastScrollLeft = 0;

$window.on('scroll', tumbleCube);
$window.on('resize', resize);

function tumbleCube () {
  var st = $window.scrollTop();
  var sl = $window.scrollLeft();

  if (st > lastScrollTop && $window.scrollTop() > 0) {
    vertiScrolling = vertiScrolling + 10;
  } else if (st < lastScrollTop && $window.scrollTop() < 0) {
    vertiScrolling = vertiScrolling - 10;
  }

  if (sl > lastScrollLeft && $window.scrollLeft() > 0) {
    horiScrolling = horiScrolling + 10;
  } else if (sl < lastScrollLeft && $window.scrollLeft() < 0) {
    horiScrolling = horiScrolling - 10;
  }

  $cube[0].style.webkitTransform = "rotateX("+ vertiScrolling +"deg) rotateY("+ horiScrolling +"deg)";
  lastScrollTop = st;
  lastScrollLeft = sl;
}

var edgeLength = 360,
    $one = $('.one'),
    $two = $('.two'),
    $three = $('.three');
    $four = $('.four'),
    $five = $('.five'),
    $six = $('.six');


function resize(event) {
  var edgeLength = 360,
      halfLength = edgeLength / 2,
      quarterLength = halfLength / 2,
      topMargin= ($window.height() - edgeLength) * 0.5;

  $cube.css('margin-top', topMargin + 'px');
  $cube.css('height', edgeLength + 'px');
  $face.css('height', edgeLength + 'px');
  $cube.css('width', edgeLength + 'px');

  $one.css('-webkit-transform',
      'rotateX(' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');
  $two.css('-webkit-transform',
      'translateZ(' + halfLength + 'px)');
  $three.css('-webkit-transform',
     'rotateY(' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');
  $four.css('-webkit-transform',
      'rotateY(' + halfLength + 'deg) translateZ(' + halfLength + 'px)');
  $five.css('-webkit-transform',
      'rotateY(-' + quarterLength + 'deg) translateZ(' + halfLength + 'px)');
  $six.css('-webkit-transform',
      'rotateX(-' + quarterLength + 'deg) translateZ(' + halfLength +
        'px) rotate(' + halfLength + 'deg)');
}

$(document).ready(resize);

function isMobile () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent);
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
    px += vx;
    py += vy;
    vx *= 0.1;
    vy *= 0.1;
    $('.cube')[0].style.webkitTransform = "rotateX(" + px + "deg) rotateY(" + py + "deg)";
  }

  setInterval(render, 50);
}

