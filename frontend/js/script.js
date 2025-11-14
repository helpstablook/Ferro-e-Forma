// js/script.js - CÓDIGO FINAL E ESTÁVEL

// ----------------------------------------------------
// --- 1. CONFIGURAÇÃO GLOBAL (DADOS E URLs) ---
// ----------------------------------------------------
const BASE_API_URL = 'http://localhost/Ferro-e-Forma/backend/'; 
const LOGIN_API_URL = BASE_API_URL + 'login.php'; 
const REGISTER_API_URL = BASE_API_URL + 'register.php';
const PRODUCTS_API_URL = ''; 

// Lista de produtos SIMULADA (Carregada no escopo global)
const productsSimulated = [
    { id: 1, nome: "Mesa de Jantar Industrial", preco: 1250.00, imagem: "Mesa.png", descricao: "Mesa robusta com tampo em madeira maciça e estrutura metálica." },
    { id: 2, nome: "Cadeira Industrial", preco: 320.00, imagem: "Cadeira.png", descricao: "Combinando conforto e estilo industrial, nossa cadeira é perfeita para escritórios." },
    { id: 3, nome: "Escrivaninha Industrial", preco: 526.00, imagem: "Escrivaninha.png", descricao: "Funcional e cheia de estilo, ideal para home offices." },
    { id: 4, nome: "Estante de Ferro", preco: 750.00, imagem: "Prateleira.png", descricao: "Estante com prateleiras de madeira e acabamento rústico." },
    { id: 5, nome: "Aparador Industrial", preco: 424.00, imagem: "Aparador.png", descricao: "Aparador que combina madeira maciça e estrutura metálica." },
    { id: 6, nome: "Luminária", preco: 250.00, imagem: "Luminaria.png", descricao: "Luminária de teto com um toque industrial e único." }, 
    { id: 7, name: "Rack de TV Industrial", price: 798.00, image: "RackTV.png", description: "Rack com estrutura metálica e prateleiras de madeira." },
    { id: 8, name: "Armário de Cozinha Industrial", price: 860.00, image: "ArmarioCozinha.png", description: "Armário com estrutura de aço e portas de madeira, ideal para cozinhas." },
    { id: 9, name: "Banco Baixo Industrial", price: 139.00, image: "BancoBaixo.png", description: "Banco compacto com estrutura em aço e assento de madeira maciça." },
    { id: 10, name: "Banqueta Alta Industrial", price: 198.00, image: "BanquetaAlta.png", description: "Banqueta alta com encosto, acabamento em aço e madeira rústica." },
];
let currentProductsData = productsSimulated; 

// ----------------------------------------------------
// --- 2. FUNÇÕES GLOBAIS ---
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
    const cartContainer = document.getElementById("cart-items-container");
    const emptyMessage = document.getElementById("empty-cart-message");
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartTotalSpan = document.getElementById("cart-total");

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

function sortAndRenderProducts(productsToDisplay, sortBy) {
    let sortedProducts = [...productsToDisplay]; 
    const productsContainer = document.getElementById("products-container");
    
    switch (sortBy) {
        case 'price-asc':
            sortedProducts.sort((a, b) => parseFloat(a.preco || a.price) - parseFloat(b.preco || b.price)); 
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => parseFloat(b.preco || b.price) - parseFloat(a.preco || a.price));
            break;
        case 'relevance':
        default:
            break; 
    }
    
    if (!productsContainer) return;

    productsContainer.innerHTML = "";
    sortedProducts.forEach((product) => {
        const priceValue = parseFloat(product.preco || product.price);
        const imageName = product.imagem || product.image;

        const card = document.createElement("article");
        card.className = "rounded-lg bg-white/5 dark:bg-black/10 shadow-lg transition-transform hover:-translate-y-2 w-full flex flex-col justify-between";
        
        card.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="block">
                <div class="aspect-h-3 aspect-w-4 bg-cover bg-center h-48 rounded-t-lg" style='background-image: url("images/${imageName}");'></div>
            </a>
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
            if (document.getElementById("cart-items-container")) {
                 renderCart();
            }
        });
    });
}

function setupProductDetailPage() {
    const detailContent = document.getElementById('product-detail-content');
    const loading = document.getElementById('product-detail-loading');
    const mainImage = document.getElementById('main-product-image');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); 

    if (!detailContent) return; 

    const product = currentProductsData.find(p => p.id == productId); 
    
    if (loading) loading.style.display = 'none';

    if (product) {
        // Prepara os dados
        const name = product.nome || product.name;
        const description = product.descricao || product.description;
        const imageName = product.imagem || product.image;
        const price = parseFloat(product.preco || product.price);

        // Preenche os dados na página
        if (document.getElementById('product-name-mobile')) document.getElementById('product-name-mobile').textContent = name;
        if (document.getElementById('product-name-desktop')) document.getElementById('product-name-desktop').textContent = name;
        if (mainImage) {
            mainImage.src = `images/${imageName}`;
            mainImage.alt = name;
        }
        if (document.getElementById('product-price')) document.getElementById('product-price').textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
        if (document.getElementById('product-description')) document.getElementById('product-description').textContent = description;
        
        // --- LÓGICA DO ZOOM (LUPA) ---
        const imageContainer = document.getElementById('image-container');
        const qtyInput = document.getElementById('product-qty');
        let zoomLevel = 1;

        if (imageContainer && mainImage) {
            imageContainer.addEventListener('click', () => {
                zoomLevel = zoomLevel === 1 ? 1.5 : 1; 
                mainImage.style.transform = `scale(${zoomLevel})`;
                mainImage.style.cursor = zoomLevel === 1.5 ? 'zoom-out' : 'zoom-in';

                if (zoomLevel === 1) {
                    mainImage.style.transformOrigin = 'center center';
                } else {
                    mainImage.style.transformOrigin = '0% 0%'; 
                }
            });
        }
        
        // --- LÓGICA DE QUANTIDADE ---
        if (document.getElementById('qty-plus') && qtyInput) {
            document.getElementById('qty-plus').addEventListener('click', () => { qtyInput.stepUp(); });
        }
        if (document.getElementById('qty-minus') && qtyInput) {
            document.getElementById('qty-minus').addEventListener('click', () => { qtyInput.stepDown(); });
        }
        
        // --- BOTÕES DE COMPRA ---
        if (document.getElementById('add-to-cart-btn') && qtyInput) {
            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                const qty = parseInt(qtyInput.value);
                const productToAdd = {
                    id: product.id,
                    name: name,
                    price: price,
                    image: `images/${imageName}`,
                    quantity: qty 
                };

                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProduct = cart.find(p => p.id === product.id);

                if (existingProduct) { existingProduct.quantity += qty; } 
                else { cart.push(productToAdd); }

                localStorage.setItem("cart", JSON.stringify(cart));
                showCartNotification(`${qty}x ${name} adicionado ao carrinho!`);
            });
        }

        if (document.getElementById('buy-now-btn')) {
            document.getElementById('buy-now-btn').addEventListener('click', () => {
                window.location.href = isUserLoggedIn() ? 'checkout.html' : 'login.html'; 
            });
        }

    } else {
        // Se o produto não for encontrado (ID inválido)
        detailContent.innerHTML = `<p class="text-center text-red-500">Produto não encontrado para o ID: ${productId}.</p>`;
    }
}


// ----------------------------------------------------
// --- 3. INICIALIZAÇÃO DO DOM (DOMContentLoaded) ---
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // --- VARIÁVEIS DO DOM (Definidas uma vez) ---
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById("login-message");
    const checkoutBtn = document.getElementById('checkout-btn');
    const productsContainer = document.getElementById("products-container");
    const cartContainer = document.getElementById("cart-items-container");
    const sortBySelect = document.getElementById('sort-by');
    const checkoutForm = document.getElementById('checkout-form');
    const logoutButton = document.getElementById("logout-button");

    
    // Lógica de Tema (mantida)
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

    if (savedTheme) { applyTheme(savedTheme); } 
    else { applyTheme(prefersDark ? 'dark' : 'light'); }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // --- EVENTOS DE FORMULÁRIOS ---
    
    // Lógica de Login (Integração com PHP)
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            if (!email || !password) {
                if (loginMessage) { loginMessage.style.color = "red"; loginMessage.textContent = 'Por favor, preencha o e-mail e a senha.'; } return;
            }

            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('password', password);

            // 1. FETCH REAL PARA O BACKEND PHP
            fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const userName = data.user.name;
                    setUserLoggedIn(true, userName); 
                    
                    if (loginMessage) { loginMessage.style.color = "green"; loginMessage.textContent = data.message + " Redirecionando..."; }
                    
                    const finalRedirect = data.redirect || 'index.html'; 
                    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
                    const redirectUrl = redirectAfterLogin ? redirectAfterLogin : finalRedirect;
                    localStorage.removeItem('redirectAfterLogin');
                    
                    setTimeout(() => { window.location.href = redirectUrl; }, 500);

                } else {
                    if (loginMessage) { loginMessage.style.color = "red"; loginMessage.textContent = data.message; }
                }
            })
            .catch(error => {
                if (loginMessage) { loginMessage.style.color = "red"; loginMessage.textContent = "Erro de conexão. Verifique o servidor PHP (XAMPP/WAMP) e a URL."; }
            });
        });
    }

    // Lógica de Cadastro (Simulação)
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            setUserLoggedIn(true, name); 
            alert('Cadastro realizado com sucesso! (Simulação)');
            const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'login.html';
            localStorage.removeItem('redirectAfterLogin'); 
            window.location.href = redirectUrl;
        });
    }

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

    // Lógica de Checkout
    if (checkoutForm) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cartItems.length > 0) {
                localStorage.removeItem('cart');
                alert('Pedido finalizado com sucesso! Em breve, entraremos em contato.');
                window.location.href = 'index.html';
            } else {
                alert('Seu carrinho está vazio.');
            }
        });
    }

    // Carrossel (mantido)
    const banner = document.querySelector('.relative.w-full.overflow-hidden.rounded-xl.min-h-\\[400px\\]');
    if (banner) {
        const imagens = [ 'images/Sala.png', 'images/Banheiro.png'  , 'images/Escritorio.png', 'images/Quarto.png', 'images/Cozinha.png' ];
        let indiceAtual = 0;

        if (!banner.style.backgroundImage || banner.style.backgroundImage.includes('none')) { banner.style.backgroundImage = `url('images/lookbook-industrial.jpg')`; }
        
        function trocarImagem() {
            indiceAtual = (indiceAtual + 1) % imagens.length;
            banner.style.backgroundImage = `url('${imagens[indiceAtual]}')`;
        }
        setInterval(trocarImagem, 4000); 
    }
    
    // --- INICIALIZAÇÕES FINAIS ---
    updateAuthUI();
    
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckoutNavigation);
    
    // PÁGINA DE PRODUTOS:
    if (productsContainer) {
        sortAndRenderProducts(currentProductsData, 'relevance');
        const sortBySelect = document.getElementById('sort-by');
        if (sortBySelect) {
            sortBySelect.addEventListener('change', (event) => {
                const selectedSort = event.target.value;
                sortAndRenderProducts(currentProductsData, selectedSort); 
            });
        }
    }
    
    // PÁGINA DE CARRINHO:
    if (cartContainer) {
        renderCart();
    }
    
    // PÁGINA DE DETALHES:
    if (window.location.pathname.includes('product-detail.html')) {
        setupProductDetailPage();
    }
});