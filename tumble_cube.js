var $window = $(window);
var $cube = $('.cube');

var vertiScrolling = 0;
var horiScrolling = 0;
var lastScrollTop = 0;
var lastScrollLeft = 0;

$window.on('scroll', tumbleCube);
$window.on('resize', resize);

function tumbleCube () {
  var st = $window.scrollTop();
  var sl = $window.scrollLeft();

  if (st > lastScrollTop && $window.scrollTop() > 0) {
    vertiScrolling = vertiScrolling + 5;
  } else if (st < lastScrollTop && $window.scrollTop() < 0) {
    vertiScrolling = vertiScrolling - 5;
  }


  if (sl > lastScrollLeft && $window.scrollLeft() > 0) {
    horiScrolling = horiScrolling + 5;
  } else if (sl < lastScrollLeft && $window.scrollLeft() < 0) {
    horiScrolling = horiScrolling - 5;
  }

  $cube[0].style.webkitTransform = "rotateX("+ vertiScrolling +"deg) rotateY("+ horiScrolling +"deg)";
  lastScrollTop = st;
  lastScrollLeft = sl;
}

function resize(event) {
  var y = ($(window).height() - 240) * 0.5;
  $('.cube').css('margin-top', y+'px');
}

$(document).ready(resize);

