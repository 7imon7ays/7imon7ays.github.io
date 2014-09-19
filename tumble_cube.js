var $window = $(window),
    $cube = $('.cube'),
    $face = $('.face');

var vertiScrolling = 0,
    horiScrolling = 0,
    lastScrollTop = 0,
    lastScrollLeft = 0;

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

