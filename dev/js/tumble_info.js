function tumbleInfo() {
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

