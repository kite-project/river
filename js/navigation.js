(function() {

var river = document.getElementById('river');
var shortcuts = document.getElementById('shortcuts');
var indicator = document.getElementById('indicator');

shortcuts.addEventListener('click', evt => {
  var href = evt.target.href;
  if (!href) return;

  var components = href.split('#');
  if (components.length < 2) return;

  var id = components[1];
  scrollToSection(id);

  evt.preventDefault();
});

var programaticallyScrolling = false;
window.onScrollEnd = function onScrollEnd() {
  if (programaticallyScrolling) {
    programaticallyScrolling = false;
    return;
  }

  scheduler.mutation(() => {
    var target = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    var section = target.closest('section');
    if (!section) {
      return;
    }
    return parseInt(section.dataset.index);
  }).then(moveIndicatorToSection);
}

river.addEventListener('scrollend', onScrollEnd);

var currentIndex = 0;
function moveIndicatorToSection(index) {
  if (typeof(index) == 'undefined') return;

  var delta = Math.abs(index - currentIndex);
  if (!delta) return;

  indicator.style.transitionDuration = `${delta * 300}ms`;
  currentIndex = index;

  return scheduler.transition(() => {
    indicator.style.transform = `translateY(${index * 100}%)`;
  }, indicator, 'transitionend');
}

window.scrollToSection = function(id) {
  var elem = document.getElementById(id);
  if (!elem) return Promise.resolve();

  return new Promise(resolve => {
    var safetyTimeout;
    var self = this;

    function finish() {
      clearTimeout(safetyTimeout);
      river.removeEventListener('scrollend', finish);

      resolve();
    }

    safetyTimeout = setTimeout(finish, 750);
    river.addEventListener('scrollend', finish);

    moveIndicatorToSection(parseInt(elem.dataset.index));
    programaticallyScrolling = true;

    var firstRow = elem.querySelector('.row') || elem;

    scheduler.mutation(() => {
      return elem.offsetTop + firstRow.offsetHeight / 2 - window.innerHeight / 2;
    }).then(destination => {
      river.scrollTo({
        top: destination,
        behavior: 'smooth'
      });
    });
  });
}

})();
