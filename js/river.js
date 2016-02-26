(function() {

fetchContent('assets/content.json')
  .then(render)
  .then(scrollToSection.bind(null, 'tabs'))
  .then(revealRiver);

function fetchContent(url) {
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.log('fetch ', err));
}

function render(content) {
  var flow = document.getElementById('flow');
  var shortcuts = document.getElementById('shortcuts');

  return Promise.all([
    scheduleContentRender(flow, content),
    scheduleShortcutsRender(shortcuts, content)
  ]);
}

function revealRiver() {
  var river = document.getElementById('river');
  return scheduler.transition(() => {
    river.classList.add('ready');
  }, river, 'animationend');
}

function scheduleContentRender(container, content) {
  var fragment = document.createDocumentFragment();

  Object.keys(content).forEach((key, index) => {
    var sectionDOM = addSection(fragment, key, content[key]);
    sectionDOM.dataset.index = index;
  });

  return scheduler.mutation(() => {
    container.appendChild(fragment);
  });
}

function addSection(container, title, content) {
  var dom = document.createElement('section');
  var pre = (content.timeline === 'pre');
  var current = (content.timeline === 'current');

  dom.classList.toggle('pre', pre);
  dom.id = title.toLowerCase();

  content.rows.forEach(row => {
    addRow(dom, row);
  });

  if (!current) {
    insertHeader(dom, title, pre);
  }

  container.appendChild(dom);
  return dom;
}

function insertHeader(container, title, pre) {
  var dom = document.createElement('h1');
  dom.textContent = title;

  if (pre) {
    container.appendChild(dom);
  } else {
    container.insertBefore(dom, container.firstElementChild);
  }
}

function addRow(container, content) {
  var dom = document.createElement('div');
  dom.classList.add('row');
  dom.style.minHeight = content.minHeight + 'px';

  content.cells.forEach(cell => {
    addCell(dom, cell);
  });

  container.appendChild(dom);
}

function addCell(container, content) {
  var dom = document.createElement('div');
  dom.classList.add('cell');
  if (content.link) {
    dom.classList.add('link');
    dom.dataset.link = content.link;
  }

  var close = document.createElement('button');
  close.classList.add('close');
  close.dataset.icon = 'close';
  dom.appendChild(close);

  var img = document.createElement('div');
  img.classList.add('img');
  img.style.backgroundImage = `url(${content.visual})`;
  var iframe = document.querySelector(`#window-manager iframe[src="${content.link}"]`);
  if (iframe) {
    img.style.backgroundImage = `-moz-element(#${iframe.id})`;
  }
  dom.appendChild(img);

  var title = document.createElement('h3');
  title.textContent = content.title;
  dom.appendChild(title);

  var description = document.createElement('p');
  description.textContent = content.description;
  dom.appendChild(description);

  container.appendChild(dom);
}

function scheduleShortcutsRender(container, content) {
  var fragment = document.createDocumentFragment();

  Object.keys(content).forEach(key => {
    addShortcutLink(fragment, key);
  });

  return scheduler.mutation(() => {
    container.appendChild(fragment);
  });
}

function addShortcutLink(container, content) {
  var dom = document.createElement('a');
  dom.textContent = content;
  dom.href = '#' + content.toLowerCase();

  container.appendChild(dom);
}

var flow = document.getElementById('flow');
flow.addEventListener('click', evt => {
  var cell = evt.target.closest('.cell');
  if (cell && cell.dataset.link) {
    var evt = new CustomEvent('tab-select', { detail: {
      target: cell,
      link: cell.dataset.link
    }});
    dispatchEvent(evt);
  }
});

})();
