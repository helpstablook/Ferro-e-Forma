document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica de Tema ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('.material-symbols-outlined');

    function applyTheme(theme) {
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

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // --- Lógica de Autenticação ---
    const navAuth = document.getElementById("nav-auth");
    const navUser = document.getElementById("nav-user");
    const userNameSpan = document.getElementById("user-name");
    const logoutButton = document.getElementById("logout-button");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById("login-message");

    function updateAuthUI() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            if (navAuth) navAuth.style.display = "none";
            if (navUser) navUser.style.display = "flex";
            if (userNameSpan) userNameSpan.textContent = currentUser.name || currentUser.email;
        } else {
            if (navAuth) navAuth.style.display = "flex";
            if (navUser) navUser.style.display = "none";
        }
    }
    updateAuthUI();

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                updateAuthUI();
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
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.email === email)) {
                alert('Email já cadastrado!');
                return;
            }
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            updateAuthUI();
            alert("Você foi desconectado.");
            window.location.href = "index.html";
        });
    }

    // --- Lógica do Carrinho e Produtos ---
    const products = [
        { id: 1, name: "Mesa de Jantar Industrial", price: 1250.00, image: "images/Mesa.png", description: "Nossa mesa de jantar industrial combina madeira maciça e estrutura metálica robusta." },
        { id: 2, name: "Cadeira Industrial", price: 320.00, image: "images/Cadeira.png", description: "Combinando conforto e estilo industrial, nossa cadeira é perfeita para escritórios e salas de jantar." },
        { id: 3, name: "Escrivaninha Industrial", price: 526.00, image: "images/Escrivaninha.png", description: "Funcional e cheia de estilo, ideal para home offices ou ambientes criativos." },
        { id: 4, name: "Estante de Ferro", price: 750.00, image: "images/Prateleira.png", description: "Estante com prateleiras de madeira e acabamento rústico." },
        { id: 5, name: "Aparador Industrial", price: 424.00, image: "images/Aparador.png", description: "Aparador que combina madeira maciça e estrutura metálica, ideal para salas." },
        { id: 6, name: "Luminária", price: 250.00, image: "images/Luminaria.png", description: "Luminária de teto com um toque industrial e único." },
        { id: 7, name: "Rack de TV Industrial", price: 798.00, image: "images/RackTV.png", description: "Rack com estrutura metálica e prateleiras de madeira. Suporte ideal para TVs grandes." },
        { id: 8, name: "Armário de Cozinha Industrial", price: 860.00, image: "images/ArmarioCozinha.png", description: "Armário com estrutura de aço e portas de madeira, ideal para cozinhas." },
        { id: 9, name: "Banco Baixo Industrial", price: 139.00, image: "images/BancoBaixo.png", description: "Banco compacto com estrutura em aço e assento de madeira maciça." },
        { id: 10, name: "Banqueta Alta Industrial", price: 198.00, image: "images/BanquetaAlta.png", description: "Banqueta alta com encosto, acabamento em aço e madeira rústica." },
    ];

    const productsContainer = document.getElementById("products-container");
    if (productsContainer) {
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

        function renderProducts() {
            productsContainer.innerHTML = "";
            products.forEach((product) => {
                const card = document.createElement("article");
                card.className = "rounded-lg bg-white/5 dark:bg-black/10 shadow-lg transition-transform hover:-translate-y-2 w-full flex flex-col justify-between";
                card.innerHTML = `
                    <div class="aspect-h-3 aspect-w-4 bg-cover bg-center h-48 rounded-t-lg" style='background-image: url("${product.image}");'></div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-lg font-bold text-[#221810] dark:text-[#f8f7f6]">${product.name}</h3>
                        <p class="text-sm text-[#221810]/70 dark:text-[#f8f7f6]/70 mt-2 flex-grow">${product.description}</p>
                        <div class="mt-4 flex items-center justify-between">
                            <span class="text-xl font-bold text-primary">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                            <button class="rounded-lg bg-primary/20 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/30 add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                `;
                productsContainer.appendChild(card);
            });

            document.querySelectorAll(".add-to-cart").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = parseInt(btn.getAttribute("data-id"));
                    const productToAdd = products.find(p => p.id === id);

                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const existingProduct = cart.find(p => p.id === id);

                    if (existingProduct) {
                        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
                    } else {
                        cart.push({ ...productToAdd, quantity: 1 });
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));
                    showCartNotification(`${productToAdd.name} adicionado ao carrinho!`);
                });
            });
        }
        renderProducts();
    }

    // --- Lógica do Carrinho ---
    const cartContainer = document.getElementById("cart-items-container");
    const emptyMessage = document.getElementById("empty-cart-message");
    const cartTotalSpan = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (cartContainer) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        function renderCart() {
            cartContainer.innerHTML = "";
            if (cart.length === 0) {
                emptyMessage.style.display = "block";
                checkoutBtn.style.display = "none";
                cartTotalSpan.textContent = "0,00";
                return;
            }

            emptyMessage.style.display = "none";
            checkoutBtn.style.display = "inline-block";

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

            cartTotalSpan.textContent = total.toFixed(2).replace('.', ',');

            document.querySelectorAll(".remove-item").forEach(btn => {
                btn.addEventListener("click", () => {
                    const idx = parseInt(btn.getAttribute("data-index"));
                    cart.splice(idx, 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                });
            });
        }
        renderCart();
    }

    // --- Finalização de Compra ---
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummaryItems = document.getElementById('order-summary-items');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    const checkoutMessage = document.getElementById('checkout-message');

    if (checkoutForm) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (currentUser && cartItems.length > 0) {
            checkoutFormContainer.style.display = 'block';
            let total = 0;
            orderSummaryItems.innerHTML = '';
            cartItems.forEach(item => {
                const quantity = item.quantity || 1;
                const subtotal = item.price * quantity;
                total += subtotal;
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name} x${quantity} - R$ ${subtotal.toFixed(2).replace('.', ',')}`;
                orderSummaryItems.appendChild(listItem);
            });
            summaryTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
        } else {
            checkoutMessage.textContent = 'Você precisa estar logado e ter itens no carrinho para finalizar a compra.';
            checkoutMessage.style.color = 'red';
            checkoutFormContainer.style.display = 'none';
        }

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

    // --- Carrossel automático de imagens no banner principal ---
    const banner = document.querySelector('.relative.w-full.overflow-hidden.rounded-xl.min-h-\\[400px\\]');
    if (banner) {
        const imagens = [
            'images/Escritorio.png',
            'images/Sala.png',
            'images/Quarto.png'
        ];

        let indiceAtual = 0;

        function trocarImagem() {
            indiceAtual = (indiceAtual + 1) % imagens.length;
            banner.style.backgroundImage = `url('${imagens[indiceAtual]}')`;
        }

        // Troca a cada 4 segundos
        setInterval(trocarImagem, 4000);
    }

});

// --- SIMULAÇÃO DE AUTENTICAÇÃO ---
/**
 * Verifica se o usuário está logado.
 * Em um projeto real, esta função consultaria o LocalStorage, Cookies ou faria uma chamada API.
 */
function isUserLoggedIn() {
    // Retorna true se houver um token ou ID de usuário salvo, por exemplo.
    // Neste exemplo, vamos checar um item no LocalStorage chamado 'userLoggedIn'
    return localStorage.getItem('userLoggedIn') === 'true'; 
}

// --- FUNÇÃO DE NAVEGAÇÃO DO CHECKOUT ---
/**
 * Gerencia a navegação ao clicar em 'Finalizar Compra'.
 */
function handleCheckoutNavigation(event) {
    // 1. Previne a navegação padrão do link
    event.preventDefault(); 

    if (isUserLoggedIn()) {
        // 2. Se logado, vai para a página de finalização de compra/pagamento
        window.location.href = 'checkout.html';
    } else {
        // 3. Se NÃO logado, armazena a intenção de ir para o checkout
        //    e redireciona para a página de login.
        
        // Salva a intenção para que, após o login, o usuário seja redirecionado para o checkout.
        localStorage.setItem('redirectAfterLogin', 'checkout.html'); 
        window.location.href = 'login.html'; 
    }
}

// --- ADICIONA EVENT LISTENER AO BOTÃO DE CHECKOUT ---
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckoutNavigation);
    }
    
    // OBS: Você pode precisar de lógica extra em login.html para ler 'redirectAfterLogin'
    // após o login bem-sucedido.
});

// js/script.js

// --- VARIÁVEIS DE SESSÃO SIMULADA ---
/**
 * Verifica se o usuário está logado usando o LocalStorage.
 */
function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true';
}

/**
 * Define o status de login (Usado após login/cadastro bem-sucedido).
 */
function setUserLoggedIn(isLoggedIn, userName = 'Usuário') {
    localStorage.setItem('userLoggedIn', isLoggedIn ? 'true' : 'false');
    if (isLoggedIn) {
        localStorage.setItem('userName', userName);
    } else {
        localStorage.removeItem('userName');
    }
}

// --- FUNÇÕES DE NAVEGAÇÃO E AUTENTICAÇÃO ---

/**
 * 1. Gerencia o clique no botão 'Finalizar Compra' (em cart.html).
 * Redireciona para checkout se logado, ou para login se deslogado.
 */
function handleCheckoutNavigation(event) {
    event.preventDefault(); 

    if (isUserLoggedIn()) {
        // Se logado, vai direto para o checkout
        window.location.href = 'checkout.html';
    } else {
        // Se NÃO logado, salva a intenção e redireciona para login
        localStorage.setItem('redirectAfterLogin', 'checkout.html'); 
        window.location.href = 'login.html'; 
    }
}

/**
 * 2. Atualiza os links do cabeçalho baseado no status de login.
 * Mostra Login/Cadastro ou Nome do Usuário/Sair.
 */
function updateHeaderAuth() {
    const navAuth = document.getElementById('nav-auth');
    const navUser = document.getElementById('nav-user');
    const userNameDisplay = document.getElementById('user-name');
    const userName = localStorage.getItem('userName') || 'Usuário';

    if (isUserLoggedIn()) {
        if (navAuth) navAuth.style.display = 'none';
        if (navUser) {
            navUser.style.display = 'flex';
            if (userNameDisplay) userNameDisplay.textContent = `Olá, ${userName}`;
        }
    } else {
        if (navAuth) navAuth.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
    }
}

/**
 * 3. Lógica para Logout.
 */
function handleLogout() {
    setUserLoggedIn(false);
    // Limpa a intenção de redirecionamento, se houver.
    localStorage.removeItem('redirectAfterLogin'); 
    // Redireciona para a Home
    window.location.href = 'index.html'; 
}

/**
 * 4. Lógica de Login/Redirecionamento (Usado em login.html)
 */
function handleLoginFormSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const messageDisplay = document.getElementById('login-message');

    // Validação básica (Simulação)
    if (emailInput.value && passwordInput.value) {
        const userName = emailInput.value.split('@')[0]; // Usa a parte inicial do e-mail como nome
        setUserLoggedIn(true, userName);
        messageDisplay.textContent = 'Login realizado com sucesso! Redirecionando...';
        messageDisplay.className = 'mt-4 text-sm text-center font-semibold text-green-500';

        // Verifica a intenção de redirecionamento
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
        localStorage.removeItem('redirectAfterLogin'); // Limpa a intenção
        
        // Redireciona após um pequeno atraso para o usuário ler a mensagem
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 500);

    } else {
        messageDisplay.textContent = 'Por favor, preencha todos os campos.';
        messageDisplay.className = 'mt-4 text-sm text-center font-semibold text-red-500';
    }
}

/**
 * 5. Lógica de Cadastro/Redirecionamento (Usado em register.html)
 */
function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    
    // Simulação de que o cadastro é bem-sucedido
    if (nameInput.value && emailInput.value && passwordInput.value) {
        setUserLoggedIn(true, nameInput.value); // Loga após o cadastro
        
        // Verifica a intenção de redirecionamento
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
        localStorage.removeItem('redirectAfterLogin'); // Limpa a intenção
        
        // Redireciona após o cadastro
        window.location.href = redirectUrl;
    }
}

// --- INICIALIZAÇÃO DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth(); // Atualiza o header em todas as páginas

    // Evento no botão de Finalizar Compra (apenas em cart.html)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckoutNavigation);
    }
    
    // Evento no botão de Logout (em todas as páginas)
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Evento no formulário de Login (apenas em login.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }

    // Evento no formulário de Cadastro (apenas em register.html)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterFormSubmit);
    }
});

// DENTRO DE js/script.js

function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const messageDisplay = document.getElementById('register-message'); // Adicione esta div no HTML

    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;

    if (!email || !password || !name) {
        messageDisplay.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    // Chamada REAL para o Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Sucesso (Response OK)
            messageDisplay.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
            messageDisplay.style.color = 'green';
            
            // Opcional: Atualizar o nome de exibição do usuário
            return userCredential.user.updateProfile({ displayName: name });
        })
        .then(() => {
            // Se chegou aqui, o usuário foi criado e logado
            setUserLoggedIn(true, name); 
            
            const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
            localStorage.removeItem('redirectAfterLogin'); 
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);

        })
        .catch((error) => {
            // Erro (Response de Falha)
            messageDisplay.textContent = `Erro no cadastro: ${error.message}`;
            messageDisplay.style.color = 'red';
            console.error(error);
        });
}