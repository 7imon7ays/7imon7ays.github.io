var $window = $(window), $cube = $('.cube');

if (isMobile()) {
  tumbleCubeMobile($cube);
} else {
  tumbleCubeDesktop($cube, $window);
}

