document.addEventListener("DOMContentLoaded", () => {
  const favoritesContainer = document.getElementById("favorites-container");
  const emptyMessage = document.getElementById("empty-favorites-message");

  async function fetchFavorites() {
    try {
      const response = await fetch('../backend/favorites.php?action=view');
      const data = await response.json();

      if (data.success) {
        renderFavorites(data.favoritos);
      } else {
        favoritesContainer.innerHTML = '';
        emptyMessage.style.display = 'block';
        alert(data.message);
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      alert("Erro ao carregar seus favoritos. Tente novamente mais tarde.");
    }
  }

  function renderFavorites(favorites) {
    favoritesContainer.innerHTML = '';
    if (favorites.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }
    emptyMessage.style.display = 'none';

    favorites.forEach(product => {
      const card = document.createElement("article");
      card.className = "rounded-lg bg-white/5 dark:bg-black/10 shadow-lg transition-transform hover:-translate-y-2 w-full";
      card.innerHTML = `
        <div class="aspect-h-3 aspect-w-4 bg-cover bg-center h-48 rounded-t-lg" style='background-image: url("images/${product.imagem}");'></div>
        <div class="p-4 flex flex-col h-full">
          <h3 class="text-lg font-bold text-[#221810] dark:text-[#f8f7f6]">${product.nome}</h3>
          <div class="mt-4 flex items-center justify-between mt-auto">
            <span class="text-xl font-bold text-primary">R$ ${parseFloat(product.preco).toFixed(2)}</span>
            <button class="rounded-lg bg-primary/20 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/30 remove-from-favorites" data-id="${product.id}">Remover</button>
          </div>
        </div>
      `;
      favoritesContainer.appendChild(card);
    });

    document.querySelectorAll(".remove-from-favorites").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Tem certeza que deseja remover este produto dos seus favoritos?")) {
          const formData = new FormData();
          formData.append('product_id', id);

          const response = await fetch('../backend/favorites.php?action=remove', {
            method: 'POST',
            body: formData
          });
          const result = await response.json();

          alert(result.message);
          if (result.success) {
            fetchFavorites(); // Recarregar a lista
          }
        }
      });
    });
  }

  fetchFavorites();
});