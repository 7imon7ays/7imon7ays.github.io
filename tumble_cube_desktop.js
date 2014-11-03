function tumbleCubeDesktop($cube, $window) {

  var xIncrement = 0, yIncrement = 0,
      xAngle = 0, yAngle = 0, zAngle = 0, nowScrolling = false,
      isFlipped90 = false, isFlipped180 = false, isFacingDown = false;

  tumbleScroll();
  tumbleMove();
  tumbleDrag();

  function tumbleScroll() {
    $window.on('mousewheel keydown', function (e) {
      var delta, keyId, didPressArrowKey, didScroll;

      nowScrolling = true;
      keyId = e.which;
      didPressArrowKey = [37,38,39,40].indexOf(keyId) !== -1;
      didScroll = keyId === 1;

      if (didPressArrowKey || didScroll) e.preventDefault();

      if (e.which === 1) {
        xIncrement = e.deltaX * 0.2;
        yIncrement = e.deltaY * 0.2;
      } else {
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
      }

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

  function tumbleMove() {

  }

  function tumbleDrag() {
    var isDragging = false;
    $cube
    .mousedown(function() {
        $window.mousemove(function(event) {
            isDragging = true;
            console.log(event.clientX, event.clientY);
        });
    })
    .mouseup(function(event) {
        var wasDragging = isDragging;
        isDragging = false;
        $window.off("mousemove");
    });
  }
}

