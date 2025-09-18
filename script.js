const DATA_URL = './data/dishes.json';
let DATA = {};

async function loadData() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
  return res.json();
}

// ---- Routing ----
function currentPath() {
  return location.hash.slice(1) || '/';
}

function routeToTitle(path) {
  // Map route -> nice title for your H2
  const map = {
    '/': 'Gathering',
    '/combos': 'Combos',
    '/kids-meal': 'Kids Meal',
    '/sandwiches': 'Sandwiches',
    '/kudu-fit': 'Kudu Fit',
    '/khafayef': 'Khafayef',
    '/sides': 'Sides',
    '/dessert': 'Dessert',
    '/sauces': 'Sauces',
    '/hot-drinks': 'Hot Drinks',
    '/cold-drinks': 'Cold Drinks'
  };
  return map[path] || 'Menu';
}

function renderRoute() {
  const path = currentPath();
  const items = Array.isArray(DATA[path]) ? DATA[path] : DATA['/'] || [];
  // update title
  const titleEl = document.getElementById('route-title');
  if (titleEl) titleEl.textContent = routeToTitle(path);
  // render grid
  renderDishes(items);
  // active state for category links
  document.querySelectorAll('.main__catagorie-links-routes').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === '#' + path);
  });
}

// ---- Rendering ----
function renderDishes(items) {
  const view = document.getElementById('dishes-view');
  const tpl  = document.getElementById('dish-card-tpl');
  const frag = document.createDocumentFragment();

  items.forEach(item => {
    const node = tpl.content.firstElementChild.cloneNode(true);

    const img = node.querySelector('.main__dishes-item-img');
    img.src = item.img;
    img.alt = item.title || '';

    node.querySelector('.main__dishes-item-title').textContent = item.title ?? '';
    node.querySelector('.price-number').textContent             = item.price ?? '';
    node.querySelector('.main__dishes-item-desc').textContent   = item.desc ?? '';
    node.querySelector('.main__dishes-item-desc-after-click-title').textContent = item.title ?? '';
    node.querySelector('.after-click-desc').textContent         = item.desc ?? '';
    node.querySelector('.kcal-number').textContent              = item.kcal ?? '';

    frag.appendChild(node);
  });

  view.replaceChildren(frag);
}

// ---- Boot ----
window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', async () => {
  try {
    DATA = await loadData();
    renderRoute();
  } catch (e) {
    console.error(e);
    document.getElementById('dishes-view').innerHTML =
      '<p class="error">Could not load menu.</p>';
  }
});

// Optional: one click handler for all “Add” buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-main');
  if (!btn) return;
  const card = btn.closest('.main__dishes-item');
  const title = card?.querySelector('.main__dishes-item-title')?.textContent?.trim();
  console.log('Add clicked:', title);
});


