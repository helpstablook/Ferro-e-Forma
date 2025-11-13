// js/script.js - CÓDIGO CONSOLIDADO E AJUSTADO PARA LIVE SERVER

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // --- URLs e Variáveis Globais ---
    // ----------------------------------------------------
    //  ANOTAÇÃO PARA INTEGRAR COM XAMPP:
    // Mude esta URL para o seu endereço PHP/MySQL. Ex: 
    // const PRODUCTS_API_URL = 'http://localhost/ferro-e-forma/backend/products.php'; 
    const PRODUCTS_API_URL = ''; // Deixamos vazio para forçar a simulação no Live Server
    
    let currentProductsData = []; // Usado para ordenação
    

    const productsSimulated = [
    { id: 1, nome: "Mesa de Jantar Industrial", preco: 1250.00, imagem: "Mesa.png", descricao: "Mesa robusta com tampo em madeira maciça e estrutura metálica." },
    { id: 2, nome: "Cadeira Industrial", preco: 320.00, imagem: "Cadeira.png", descricao: "Combinando conforto e estilo industrial, nossa cadeira é perfeita para escritórios." },
    { id: 3, nome: "Escrivaninha Industrial", preco: 526.00, imagem: "Escrivaninha.png", descricao: "Funcional e cheia de estilo, ideal para home offices." },
    { id: 4, nome: "Estante de Ferro", preco: 750.00, imagem: "Prateleira.png", descricao: "Estante com prateleiras de madeira e acabamento rústico." },
    { id: 5, nome: "Aparador Industrial", preco: 424.00, imagem: "Aparador.png", descricao: "Aparador que combina madeira maciça e estrutura metálica." },
    { id: 6, nome: "Luminária", preco: 250.00, imagem: "Luminária.png", descricao: "Luminária de teto com um toque industrial e único." }, 
    { id: 7, nome: "Rack de TV Industrial", preco: 798.00, imagem: "RackTV.png", descricao: "Rack com estrutura metálica e prateleiras de madeira." },
    { id: 8, nome: "Armário de Cozinha Industrial", preco: 860.00, imagem: "ArmarioCozinha.png", descricao: "Armário com estrutura de aço e portas de madeira, ideal para cozinhas." },
    { id: 9, nome: "Banco Baixo Industrial", preco: 139.00, imagem: "BancoBaixo.png", descricao: "Banco compacto com estrutura em aço e assento de madeira maciça." },
    { id: 10, nome: "Banqueta Alta Industrial", preco: 198.00, imagem: "BanquetaAlta.png", descricao: "Banqueta alta com encosto, acabamento em aço e madeira rústica." },
];
    currentProductsData = productsSimulated; // Inicializa a lista de dados atual com a simulação

    // ----------------------------------------------------
    // --- FUNÇÕES DE SESSÃO E AUTENTICAÇÃO ---
    // ----------------------------------------------------

    function isUserLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    function setUserLoggedIn(isLoggedIn, userName = 'Usuário') {
        localStorage.setItem('userLoggedIn', isLoggedIn ? 'true' : 'false');
        if (isLoggedIn) {
            localStorage.setItem('userName', userName);
        } else {
            localStorage.removeItem('userName');
        }
    }

    function updateAuthUI() {
        const navAuth = document.getElementById("nav-auth");
        const navUser = document.getElementById("nav-user");
        const userNameSpan = document.getElementById("user-name");
        const userName = localStorage.getItem('userName') || 'Usuário';

        if (isUserLoggedIn()) {
            if (navAuth) navAuth.style.display = "none";
            if (navUser) {
                navUser.style.display = "flex";
                if (userNameSpan) userNameSpan.textContent = `Olá, ${userName}`;
            }
        } else {
            if (navAuth) navAuth.style.display = "flex";
            if (navUser) navUser.style.display = "none";
        }
    }

    // ----------------------------------------------------
    // --- LÓGICA DE TEMA ---
    // ----------------------------------------------------

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.material-symbols-outlined') : null;

    function applyTheme(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeIcon.textContent = 'light_mode';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            themeIcon.textContent = 'dark_mode';
            localStorage.setItem('theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // ----------------------------------------------------
    // --- LÓGICA DE PRODUTOS (RENDERIZAÇÃO) ---
    // ----------------------------------------------------

    function showCartNotification(message) {
        const notification = document.getElementById('cart-notification');
        if (!notification) return;
        notification.textContent = message;
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
        }, 3000);
    }

    function sortAndRenderProducts(productsToDisplay, sortBy) {
        let sortedProducts = [...productsToDisplay]; 
        
        switch (sortBy) {
            case 'price-asc':
                sortedProducts.sort((a, b) => parseFloat(a.preco || a.price) - parseFloat(b.preco || b.price)); 
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => parseFloat(b.preco || b.price) - parseFloat(a.preco || a.price));
                break;
            case 'relevance':
            default:
                // Ordem do array original
                break; 
        }
        
        const productsContainer = document.getElementById("products-container");
        if (!productsContainer) return;

        productsContainer.innerHTML = "";
        sortedProducts.forEach((product) => {
            // Usa 'nome', 'preco', 'imagem' (padrão MySQL/Simulação)
            const priceValue = parseFloat(product.preco || product.price);
            const imageName = product.imagem || product.image;

            const card = document.createElement("article");
            card.className = "rounded-lg bg-white/5 dark:bg-black/10 shadow-lg transition-transform hover:-translate-y-2 w-full flex flex-col justify-between";
            
            card.innerHTML = `
                <div class="aspect-h-3 aspect-w-4 bg-cover bg-center h-48 rounded-t-lg" style='background-image: url("images/${imageName}");'></div>
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="text-lg font-bold text-[#221810] dark:text-[#f8f7f6]">${product.nome || product.name}</h3>
                    <p class="text-sm text-[#221810]/70 dark:text-[#f8f7f6]/70 mt-2 flex-grow">${product.descricao || product.description || ''}</p>
                    <div class="mt-4 flex items-center justify-between">
                        <span class="text-xl font-bold text-primary">R$ ${priceValue.toFixed(2).replace('.', ',')}</span>
                        <button class="rounded-lg bg-primary/20 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/30 add-to-cart" data-id="${product.id}" data-price="${priceValue}" data-name="${product.nome || product.name}" data-image="images/${imageName}">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(card);
        });
        
        document.querySelectorAll(".add-to-cart").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const productToAdd = {
                    id: id,
                    name: btn.getAttribute("data-name"),
                    price: parseFloat(btn.getAttribute("data-price")),
                    image: btn.getAttribute("data-image")
                };

                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProduct = cart.find(p => p.id === id);

                if (existingProduct) {
                    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
                } else {
                    cart.push({ ...productToAdd, quantity: 1 });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                showCartNotification(`${productToAdd.name} adicionado ao carrinho!`);
                // Se estiver na página do carrinho, precisa renderizar novamente
                if (document.getElementById("cart-items-container")) {
                     renderCart();
                }
            });
        });
    }

    // ----------------------------------------------------
    // --- LÓGICA DO CARRINHO (cart.html) e Checkout ---
    // ----------------------------------------------------
    
    const cartContainer = document.getElementById("cart-items-container");
    const emptyMessage = document.getElementById("empty-cart-message");
    const cartTotalSpan = document.getElementById("cart-total");
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    const checkoutMessage = document.getElementById('checkout-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummaryItems = document.getElementById('order-summary-items');
    const summaryTotal = document.getElementById('summary-total');
    const logoutButton = document.getElementById("logout-button");

    function handleCheckoutNavigation(e) {
        if (e) e.preventDefault();
        if (isUserLoggedIn()) {
            window.location.href = 'checkout.html';
        } else {
            localStorage.setItem('redirectAfterLogin', 'checkout.html'); 
            window.location.href = 'login.html'; 
        }
    }

    function renderCart() {
        if (!cartContainer) return;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartContainer.innerHTML = "";
        
        if (cart.length === 0) {
            if (emptyMessage) emptyMessage.style.display = "block";
            if (checkoutBtn) checkoutBtn.style.display = "none";
            if (cartTotalSpan) cartTotalSpan.textContent = "0,00";
            return;
        }

        if (emptyMessage) emptyMessage.style.display = "none";
        if (checkoutBtn) checkoutBtn.style.display = "inline-block";

        let total = 0;
        cart.forEach((item, index) => {
            const quantity = item.quantity || 1;
            total += item.price * quantity;

            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item bg-white/5 dark:bg-black/10 shadow-lg rounded-lg p-4 flex items-center space-x-4";
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-md">
                <div class="flex-1">
                    <h4 class="font-bold">${item.name}</h4>
                    <p class="text-sm text-[#221810]/70 dark:text-[#f8f7f6]/70">R$ ${item.price.toFixed(2).replace('.', ',')} x ${quantity}</p>
                    <p class="font-bold text-primary">Subtotal: R$ ${(item.price * quantity).toFixed(2).replace('.', ',')}</p>
                </div>
                <button data-index="${index}" class="remove-item rounded-lg bg-red-500/20 p-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/30">
                    Remover
                </button>
            `;
            cartContainer.appendChild(itemDiv);
        });

        if (cartTotalSpan) cartTotalSpan.textContent = total.toFixed(2).replace('.', ',');

        document.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart.splice(idx, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });
    }
    
    // Lógica de Checkout (Preenchimento do resumo)
    if (checkoutForm) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const currentUser = isUserLoggedIn(); 

        if (currentUser && cartItems.length > 0) {
            if (checkoutFormContainer) checkoutFormContainer.style.display = 'block';
            let total = 0;
            if (orderSummaryItems) orderSummaryItems.innerHTML = '';
            
            cartItems.forEach(item => {
                const quantity = item.quantity || 1;
                const subtotal = item.price * quantity;
                total += subtotal;
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name} x${quantity} - R$ ${subtotal.toFixed(2).replace('.', ',')}`;
                if (orderSummaryItems) orderSummaryItems.appendChild(listItem);
            });
            if (summaryTotal) summaryTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
        } else {
            if (checkoutMessage) checkoutMessage.textContent = 'Você precisa estar logado e ter itens no carrinho para finalizar a compra.';
            if (checkoutMessage) checkoutMessage.style.color = 'red';
            if (checkoutFormContainer) checkoutFormContainer.style.display = 'none';
        }

        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cartItems.length > 0) {
                // ⚠️ Aqui você faria o fetch final para checkout.php
                localStorage.removeItem('cart');
                alert('Pedido finalizado com sucesso! Em breve, entraremos em contato.');
                window.location.href = 'index.html';
            } else {
                alert('Seu carrinho está vazio.');
            }
        });
    }

    // ----------------------------------------------------
    // --- LÓGICA DE FORMULÁRIOS (Simulação de POST) ---
    // ----------------------------------------------------
    
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById("login-message");

    // LÓGICA DE LOGIN (Simulação)
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // ⚠️ Placeholder para o seu FETCH para http://localhost/backend/login.php
            
            // SIMULAÇÃO DE SUCESSO (DEVE SER REMOVIDA APÓS INTEGRAR O FETCH REAL)
            const email = document.getElementById("login-email").value.trim();
            const userName = email.split('@')[0];
            
            setUserLoggedIn(true, userName);
            
            if (loginMessage) {
                loginMessage.style.color = "green";
                loginMessage.textContent = "Login realizado com sucesso! Redirecionando...";
            }
            
            const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
            localStorage.removeItem('redirectAfterLogin'); 
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        });
    }

    // LÓGICA DE CADASTRO (Simulação)
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // ⚠️ Placeholder para o seu FETCH para http://localhost/backend/register.php
            
            // SIMULAÇÃO DE SUCESSO (DEVE SER REMOVIDA APÓS INTEGRAR O FETCH REAL)
            const name = document.getElementById('register-name').value;
            
            setUserLoggedIn(true, name); 
            
            alert('Cadastro realizado com sucesso!');
            
            const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'login.html';
            localStorage.removeItem('redirectAfterLogin'); 
            
            window.location.href = redirectUrl;
        });
    }

    // ----------------------------------------------------
    // --- LÓGICA DIVERSA ---
    // ----------------------------------------------------

    // Lógica de Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            setUserLoggedIn(false);
            localStorage.removeItem('redirectAfterLogin'); 
            alert("Você foi desconectado.");
            window.location.href = "index.html"; 
        });
    }

    // Carrossel automático de imagens no banner principal (index.html)
    const banner = document.querySelector('.relative.w-full.overflow-hidden.rounded-xl.min-h-\\[400px\\]');
    if (banner) {
        const imagens = [
            'images/Escritorio.png',
            'images/Sala.png',
            'images/Quarto.png'
        ];

        let indiceAtual = 0;

        // Garante que a imagem inicial seja definida se o CSS falhar
        if (!banner.style.backgroundImage || banner.style.backgroundImage.includes('none')) {
            banner.style.backgroundImage = `url('images/lookbook-industrial.jpg')`;
        }
        
        function trocarImagem() {
            indiceAtual = (indiceAtual + 1) % imagens.length;
            banner.style.backgroundImage = `url('${imagens[indiceAtual]}')`;
        }

        setInterval(trocarImagem, 4000); // Troca a cada 4 segundos
    }
    
    // --- INICIALIZAÇÕES FINAIS ---
    updateAuthUI();
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckoutNavigation);
    
    // 🚨 Inicia o carregamento (simulado) dos produtos
    sortAndRenderProducts(currentProductsData, 'relevance');
    
    // Adiciona o listener de ordenação para a lista simulada
    const sortBySelect = document.getElementById('sort-by');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', (event) => {
            const selectedSort = event.target.value;
            sortAndRenderProducts(currentProductsData, selectedSort); 
        });
    }
});