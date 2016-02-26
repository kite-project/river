(function() {

var manager = document.getElementById('window-manager');

addEventListener('tab-select', evt => {
  if (!evt.detail) return;

  var from = evt.detail.target;
  var to = manager.querySelector(`iframe[src="${evt.detail.link}"]`);

  if (!to || !from) return;


  hideClose(from)
    .then(setup.bind(null, from, to))
    .then(waitForPaint)
    .then(grow.bind(null, to))
    .then(finish.bind(null, to));
});

function hideClose(from) {
  return scheduler.transition(() => {
    from.classList.add('open')
  }, from, 'transitionend');
}

function showClose() {
  var to = document.querySelector('#tabs .cell.open');
  if (!to) return Promise.resolve();
  return scheduler.transition(() => {
    to.classList.remove('open')
  }, to, 'transitionend');
}

function setup(from, to) {
  return scheduler.mutation(() => {
    var fromRect = from.querySelector('.img').getBoundingClientRect();

    var scaleX = fromRect.width / window.innerWidth;
    var scaleY = fromRect.height / window.innerHeight;

    to.dataset.shrinkTransform =
      to.style.transform = `translate(${fromRect.x}px, ${fromRect.y}px) scale(${scaleX}, ${scaleY})`;

    to.classList.add('active');
  });
}

function waitForPaint() {
  return new Promise(resolve => {
    // XXX: the paint is killing us
    requestAnimationFrame(setTimeout.bind(null, resolve, 250));
  });
}

function grow(iframe) {
  iframe.style.transition = 'transform 0.35s ease';
  return scheduler.transition(() => {
    iframe.style.transform = '';
  }, iframe, 'transitionend', 750);
}

function shrink(iframe) {
  iframe.style.transition = 'transform 0.35s ease';
  return scheduler.transition(() => {
    iframe.style.transform = iframe.dataset.shrinkTransform;
  }, iframe, 'transitionend', 750);
}

function finish(iframe) {
  iframe.style.transition = '';
}

function finishShrink(iframe) {
  iframe.classList.remove('active');
  iframe.style.transition = '';
  iframe.style.transform = '';
  iframe.dataset.shrinkTransform = '';
}

addEventListener('message', evt => {
  var iframe = evt.source.frameElement;
  shrink(iframe)
    .then(finishShrink.bind(null, iframe))
    .then(showClose);
});

})();
