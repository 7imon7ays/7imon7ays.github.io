// $cube and $window defined in resize.js

(function() {

  if (isMobile()) {
    tumbleCubeMobile($cube);
  } else {
    tumbleCubeDesktop($cube, $window);
    tumbleInfo();
  }

}());

