// API URL
const API_URL = 'http://localhost:3000/products';

// DOM Elements
const productContainer = document.querySelector('.product-cards');
const form = document.querySelector('.FormContainer__form');
const nameInput = form.querySelector('input[placeholder="Nombre..."]');
const priceInput = form.querySelector('input[placeholder="Precio..."]');
const imageInput = form.querySelector('input[placeholder="Imagen..."]');
const submitButton = document.getElementById('boton-enviar');
const clearButton = document.getElementById('boton-cancelar');

// Load products
async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    
    // Clear existing products (except title)
    const cards = productContainer.querySelectorAll('.card');
    cards.forEach(card => card.remove());
    
    // Add products
    products.forEach(product => {
      const card = createProductCard(product);
      productContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Error loading products. Please try again.');
  }
}

// Create product card
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card__image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="card__description">
      <h2>${product.name}</h2>
    </div>
    <div class="card__price">
      <p>$ ${product.price.toFixed(2)}</p>
      <i class="fas fa-trash" data-id="${product.id}"></i>
    </div>
  `;
  
  // Add delete event listener
  const deleteBtn = card.querySelector('.fa-trash');
  deleteBtn.addEventListener('click', () => deleteProduct(product.id));
  
  return card;
}

// Add product
async function addProduct(event) {
  event.preventDefault();
  
  const product = {
    name: nameInput.value,
    price: parseFloat(priceInput.value),
    image: imageInput.value || 'stormtroop.jpg' // Default image if none provided
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) throw new Error('Error adding product');
    
    clearForm();
    loadProducts();
  } catch (error) {
    console.error('Error adding product:', error);
    alert('Error adding product. Please try again.');
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Error deleting product');
    
    loadProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product. Please try again.');
  }
}

// Clear form
function clearForm() {
  nameInput.value = '';
  priceInput.value = '';
  imageInput.value = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadProducts);
submitButton.addEventListener('click', addProduct);
clearButton.addEventListener('click', clearForm);