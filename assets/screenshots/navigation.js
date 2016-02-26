(function() {
  var touchEnabled = ('ontouchstart' in window);
  if (touchEnabled) {
    addEventListener('touchstart', (evt) => {
      if (evt.touches.length == 2) {
        parent.postMessage('click', '*');
        evt.preventDefault();
      }
    });
    return;
  }
  addEventListener('click', (evt) => {
    parent.postMessage('click', '*');
    evt.preventDefault();
  });
})();
