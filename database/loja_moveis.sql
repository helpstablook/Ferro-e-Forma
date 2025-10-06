CREATE DATABASE IF NOT EXISTS loja_moveis;
USE loja_moveis;

-- ==============================
-- Categorias
-- ==============================
CREATE TABLE `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO `categorias` (`nome`) VALUES
('Sala de Estar'),
('Assentos'),
('Escritório');

-- ==============================
-- Produtos
-- ==============================
CREATE TABLE `produtos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` TEXT,
  `preco` DECIMAL(10, 2) NOT NULL,
  `imagem` VARCHAR(255),
  `estoque` INT NOT NULL DEFAULT 0,
  `categoria_id` INT,
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`)
);

-- Categoria Sala de Estar (ID 1)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Aparador Industrial', 'Nosso aparador industrial combina madeira maciça e estrutura metálica robusta, ideal para decorar sua sala com estilo e praticidade.', 424.00, 'img/Aparador.png', 8, 1);

-- Categoria Assentos (ID 2)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Cadeira Industrial', 'Combinando conforto e estilo industrial, nossa cadeira é perfeita para escritórios, salas de jantar ou ambientes criativos. Produzida com estrutura metálica e assento ergonômico em madeira ou estofado.', 175.00, 'img/Cadeira.png', 15, 2);

-- Categoria Escritório (ID 3)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Escrivaninha Industrial', 'Funcional e cheia de estilo, a escrivaninha industrial é ideal para escritórios, home offices ou ambientes criativos. Com estrutura metálica e tampo em madeira, oferece resistência e um visual moderno.', 526.00, 'img/Escrivaninha.png', 6, 3);

-- ==============================
-- Usuários
-- ==============================
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL -- Armazenar hash!
);

-- Exemplo de usuários (hash fictício de 'senha123')
INSERT INTO `usuarios` (`nome`, `email`, `senha`) VALUES
('Administrador', 'admin@lojamoveis.com', '$2y$10$N9WOF0wo6kF/XJ0iXqXqMOu23qY50.Y2.kX5qK8r9p1Gk8i.lYq.G'),
('Cliente Teste', 'cliente@exemplo.com', '$2y$10$N9WOF0wo6kF/XJ0iXqXqMOu23qY50.Y2.kX5qK8r9p1Gk8i.lYq.G');

-- ==============================
-- Carrinho
-- ==============================
CREATE TABLE `carrinho` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `produto_id` INT,
  `quantidade` INT NOT NULL DEFAULT 1,
  `adicionado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
  FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`),
  UNIQUE KEY `usuario_produto` (`usuario_id`, `produto_id`) -- evita duplicação
);

-- ==============================
-- Pedidos
-- ==============================
CREATE TABLE `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `valor_total` DECIMAL(10, 2) NOT NULL,
  `data_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Enviado, Concluído
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
);

-- ==============================
-- Itens do Pedido
-- ==============================
CREATE TABLE `itens_pedido` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT,
  `produto_id` INT,
  `quantidade` INT NOT NULL,
  `preco_unitario` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`),
  FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`)
);