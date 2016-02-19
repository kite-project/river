(function() {

var fullscreenToggle = document.getElementById('fullscreen-toggle');
var screen = document.getElementById('screen');

fullscreenToggle.addEventListener('click', () => {
  screen.requestFullscreen();
});


addEventListener('load', () => replyToChrome('system-message-listener-ready'));

var remoteDebugging = false;
if (!remoteDebugging) return;

navigator.mozSettings.createLock().set({
  'devtools.debugger.remote-enabled': true
});
navigator.mozSettings.createLock().set({
  'debugger.remote-mode': 'adb-devtools'
});

addEventListener('mozChromeEvent', e => {
  if (e.detail.type !== 'remote-debugger-prompt') {
    return;
  }
  replyToChrome('remote-debugger-prompt', { authResult: 'ALLOW' });
});


function replyToChrome(type, detail) {
  var d = detail || {};
  d.type = type;

  var evt = new CustomEvent('mozContentEvent', {
    bubbles: true,
    detail: d
  });
  dispatchEvent(evt);
}

})();
