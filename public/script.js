let cursor = null;
let products;
let productCategory = '';
let isLoading = false;

const filters = document.getElementById('filters');
const container = document.getElementById('products');
const sentinel = document.getElementById('sentinel');
 
const callBack = async (entries) => {
  if (!entries[0].isIntersecting || isLoading) return;
  await loadNextPage();
};
const options = {
  root: null,
  threshold: 0.5
};
const observer = new IntersectionObserver(callBack, options);
observer.observe(sentinel);


async function data() {
  const params = new URLSearchParams();
  if (cursor) {
    params.set('id', cursor.id);
    params.set('created_at', cursor.created_at);
  }
  if (productCategory) {
    params.set('category', productCategory);
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
  productCategory = e.target.value;
  cursor = null;
  history = [];
  await loadData();
});

async function loadData() {
  await data();
  await renderProducts();
}

async function loadNextPage() {
  isLoading = true;
  if (products.cursor) cursor = products.cursor;
  await loadData();
  isLoading = false;
  if (!products.cursor) observer.disconnect();
}

loadData();