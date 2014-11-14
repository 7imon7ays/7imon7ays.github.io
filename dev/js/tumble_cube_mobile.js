function tumbleCubeMobile ($cube) {
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
    $cube[0].style.webkitTransform = "rotateX(" + px + "deg) rotateY(" + py + "deg)";
    $cube[0].style.MozTransform = "rotateX(" + px + "deg) rotateY(" + py + "deg)";
  }

  setInterval(render, 50);
}

function isMobile () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent);
}

