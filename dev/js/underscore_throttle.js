(function ($) {

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

})(jQuery);