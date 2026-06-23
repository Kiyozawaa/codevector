let cursor = null;
let products;
let history = [];
let category = '';

const filters = document.getElementById('filters');
const container = document.getElementById('products');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageCounter = document.getElementById('page-count');

async function data() {
  const params = new URLSearchParams();
  if (cursor) {
    params.set('id', cursor.id);
    params.set('created_at', cursor.created_at);
  }
  if (category) {
    params.set('category', category);
  }
  const conn = await fetch(`/api/products?${params}`);
  products = await conn.json();
}

async function renderProducts() {
  for (const product of products.products) {
    const div = document.createElement('div');
    div.classList.add('card');
    const name = document.createElement('div');
    name.classList.add('name');
    const category = document.createElement('div');
    category.classList.add('category');
    const price = document.createElement('div');
    price.classList.add('price');
    name.textContent = product.name;
    category.textContent = product.category;
    price.textContent = `₹ ${product.price}`;
    div.appendChild(name);
    div.appendChild(category);
    div.appendChild(price);
    container.appendChild(div);
  }
}

filters.addEventListener('change', async (e) => {
  category = e.target.value;
  cursor = null;
  history = [];
  await loadData();
});

prevBtn.addEventListener('click', async () => {
  cursor = history.pop();
  await loadData();
});

nextBtn.addEventListener('click', async () => {
  history.push(cursor);
  cursor = products.cursor;
  await loadData();
});

async function loadData() {
  await data();
  container.innerHTML = '';
  await renderProducts();
  prevBtn.disabled = history.length === 0;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

await loadData();