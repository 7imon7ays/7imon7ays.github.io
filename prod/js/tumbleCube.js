/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));
;(function ($) {

  // replaced underscore dependencies

  function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date().getTime() //_.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };

    return function() {
      // var now = _.now();
      var now = new Date().getTime()
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  $.throttle = throttle;

})(jQuery);;var $cube = $('.cube'), $window = $(window);

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

;function tumbleCubeMobile ($cube) {
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

;function tumbleCubeDesktop($cube, $window) {

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

;function tumbleInfo() {
  var throttledFlashInfo = $.throttle(flashInfo, 3000);

  $window.on("mousedown keydown", function (e) {
    var clickedOnAnchor = $(e.target).is('a');
    if (clickedOnAnchor) return;
     
    throttledFlashInfo();
  });

  function flashInfo () {
    $(".flash > p").fadeIn(500).fadeOut(500);
  }
}

;// $cube and $window defined in resize.js

(function() {

  if (isMobile()) {
    tumbleCubeMobile($cube);
  } else {
    tumbleCubeDesktop($cube, $window);
    tumbleInfo();
  }

}());

