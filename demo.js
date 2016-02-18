(function() {
  var fullscreenToggle = document.getElementById('fullscreen-toggle');
  var screen = document.getElementById('screen');

  fullscreenToggle.addEventListener('click', () => {
    screen.requestFullscreen();
  });
})();
