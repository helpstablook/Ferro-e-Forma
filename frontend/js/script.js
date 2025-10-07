// Checa login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");
  const navAuth = document.getElementById("nav-auth");
  const navUser = document.getElementById("nav-user");
  const userNameSpan = document.getElementById("user-name");
  const logoutButton = document.getElementById("logout-button");

  // Exibe usuário logado na navbar
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    navAuth.style.display = "none";
    navUser.style.display = "inline";
    userNameSpan.textContent = currentUser.name || currentUser.email;
  }

  // Login
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      navAuth.style.display = "none";
      navUser.style.display = "inline";
      userNameSpan.textContent = user.name || user.email;
      loginMessage.style.color = "green";
      loginMessage.textContent = "Login realizado com sucesso!";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      loginMessage.style.color = "red";
      loginMessage.textContent = "Email ou senha incorretos!";
    }
  });

  // Logout
  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    navAuth.style.display = "inline";
    navUser.style.display = "none";
  });
});


updateNav();

// Registro de usuário
const registerForm = document.getElementById('register-form');
if(registerForm){
  registerForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if(users.find(u=>u.email === email)){
      alert('Email já cadastrado!');
      return;
    }
    users.push({name,email,password});
    localStorage.setItem('users', JSON.stringify(users));
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
  });
}

// Acessibilidade
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-dark-mode');
    const body = document.body;
    const isDarkMode = localStorage.getItem('theme') === 'dark';
  
    if (isDarkMode) {
        body.classList.add('dark');
    }
 
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark');
        if (body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});

// Login
const loginForm = document.getElementById('login-form');
if(loginForm){
  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u=>u.email === email && u.password === password);
    if(user){
      localStorage.setItem('loggedUser', JSON.stringify(user));
      alert('Login efetuado!');
      window.location.href = 'index.html';
    } else {
      alert('Email ou senha incorretos!');
    }
  });
}

// carrinho no localStorage
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items-container");
  const emptyMessage = document.getElementById("empty-cart-message");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartContainer.innerHTML = "";
    if(cart.length === 0){
      emptyMessage.style.display = "block";
      checkoutBtn.style.display = "none";
      cartTotal.textContent = "0,00";
      return;
    }
    emptyMessage.style.display = "none";
    checkoutBtn.style.display = "inline-block";

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <button data-index="${index}" class="remove-item">Remover</button>
        </div>
      `;
      cartContainer.appendChild(itemDiv);
    });
    cartTotal.textContent = total.toFixed(2);

    // remover itens
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-index");
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});
