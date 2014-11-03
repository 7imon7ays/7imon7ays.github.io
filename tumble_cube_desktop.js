function tumbleCubeDesktop($cube, $window) {

  var xIncrement = 0, yIncrement = 0,
      xAngle = 0, yAngle = 0, zAngle = 0, nowScrolling = false,
      isFlipped90 = false, isFlipped180 = false, isFacingDown = false;

  tumbleScroll();
  tumbleMove();
  tumbleDrag();

  function tumbleScroll() {
    $window.on('mousewheel', function(e) {
      var keyId, didScroll;

      nowScrolling = true;
      keyId = e.which;
      didScroll = keyId === 1;

      if (didScroll) e.preventDefault();

      if (e.which === 1) {
        xIncrement = e.deltaX * 0.2;
        yIncrement = e.deltaY * 0.2;
      }

      tumble();
    });
  }

  function tumbleMove() {
    $window.on('keydown', function(e) {
      var delta, keyId, didPressArrowKey;
      didPressArrowKey = [37,38,39,40].indexOf(keyId) !== -1;

      if (didPressArrowKey) e.preventDefault();

      xIncrement = 0;
      yIncrement = 0;
      delta = 5;

      switch(e.which) {
        case 37:
          xIncrement += delta;
          break;
        case 38:
          yIncrement -= delta;
          break;
        case 39:
          xIncrement -= delta;
          break;
        case 40:
          yIncrement += delta;
          break;
        default: return;
      }

      tumble();
    });
  }

  function tumbleDrag() {
    var xOrigin, yOrigin;
    $cube.mousedown(function(e) {
      xOrigin = e.clientX, yOrigin = e.clientY;
      $window.mousemove(function(e) {
          xAngle += (e.clientX - xOrigin) / 50;
          yAngle -= (e.clientY - yOrigin) / 50;
          tumble();
      });
    });

    $window.mouseup(function() {
      $window.off("mousemove");
    });
  }

  function tumble() {
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
    $cube[0].style.MozTransform = "rotateX(" + yAngle + "deg) rotateY(" + xAngle + "deg) rotateZ(" + zAngle + "deg)";

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
}

