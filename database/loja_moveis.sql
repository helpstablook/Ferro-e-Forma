CREATE DATABASE IF NOT EXISTS loja_moveis;
USE loja_moveis;

-- --------------------------------------------------------
-- TABELA: Categorias
-- --------------------------------------------------------

CREATE TABLE `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(50) NOT NULL UNIQUE
);

-- Inserção de Categorias
INSERT INTO `categorias` (`nome`) VALUES
('Sala de Estar'), -- ID 1
('Assentos'),      -- ID 2
('Escritório'),    -- ID 3
('Cozinha'),       -- ID 4
('Quarto'),        -- ID 5
('Banheiro'),      -- ID 6
('Armazenamento'), -- ID 7
('Decoração');     -- ID 8

-- --------------------------------------------------------
-- TABELA: Produtos
-- --------------------------------------------------------

CREATE TABLE `produtos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` TEXT,
  `preco` DECIMAL(10, 2) NOT NULL,
  `imagem` VARCHAR(255), -- Caminho corrigido para 'images/'
  `estoque` INT NOT NULL DEFAULT 0,
  `categoria_id` INT,
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`)
);

-- --------------------------------------------------------
-- INSERÇÃO DE PRODUTOS
-- --------------------------------------------------------

-- Sala de Estar (ID 1)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Aparador Industrial', 'Nosso aparador industrial combina madeira maciça e estrutura metálica robusta, ideal para decorar sua sala com estilo e praticidade.', 424.00, 'images/Aparador.png', 8, 1),
('Mesa de Centro Industrial', 'Tampo em madeira de demolição e base metálica. Ideal para salas modernas.', 312.00, 'images/MesaCentro.png', 10, 1),
('Rack de TV Industrial', 'Rack com estrutura metálica e prateleiras de madeira. Suporte ideal para TVs grandes.', 798.00, 'images/RackTV.png', 4, 1),
('Painel de TV Industrial', 'Painel de TV em madeira rústica e estrutura de ferro preto, ideal para salas modernas estilo loft.', 1120.00, 'images/PainelTV.png', 3, 1),
('Sala Completa Industrial', 'Conjunto com sofá, rack e mesa de centro, perfeito para um ambiente integrado.', 3500.00, 'images/Sala.png', 1, 1); -- PRODUTO FALTANTE

-- Assentos (ID 2)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Cadeira Industrial', 'Cadeira com estrutura metálica e assento ergonômico em madeira ou estofado.', 175.00, 'images/Cadeira.png', 15, 2),
('Banco Baixo Industrial', 'Banco compacto com estrutura em aço e assento de madeira maciça.', 139.00, 'images/BancoBaixo.png', 12, 2),
('Banqueta Alta Industrial', 'Banqueta alta com encosto, acabamento em aço escovado e madeira rústica.', 198.00, 'images/BanquetaAlta.png', 9, 2),
('Poltrona Industrial Vintage', 'Poltrona com estrutura metálica e estofado em couro sintético envelhecido.', 549.00, 'images/PoltronaVintage.png', 3, 2),
('Sofá Industrial', 'Sofá de dois lugares com estrutura metálica exposta e estofado em couro marrom envelhecido.', 1890.00, 'images/SofaIndustrial.png', 2, 2);

-- Escritório (ID 3)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Escrivaninha Industrial', 'Escrivaninha com estrutura metálica e tampo em madeira. Ideal para home office.', 526.00, 'images/Escrivaninha.png', 6, 3),
('Cadeira de Escritório Industrial', 'Cadeira com rodízios, estrutura de aço e assento estofado.', 399.00, 'images/CadeiraEscritorio.png', 7, 3),
('Mesa de Reunião Industrial', 'Mesa ampla de reunião com pés metálicos e tampo de madeira rústica.', 1760.00, 'images/MesaReuniao.png', 1, 3),
('Mesa de Escritório em L', 'Ampla mesa em formato L com estrutura metálica e gaveteiro acoplado.', 950.00, 'images/MesaEscritorioL.png', 4, 3);

-- Cozinha (ID 4)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Armário de Cozinha Industrial', 'Armário com estrutura de aço e portas de madeira. Ideal para utensílios e mantimentos.', 860.00, 'images/ArmarioCozinha.png', 3, 4),
('Prateleira Suspensa Cozinha', 'Prateleira com suporte metálico para pendurar utensílios e armazenar condimentos.', 248.00, 'images/PrateleiraCozinha.png', 10, 4),
('Ilha de Cozinha Industrial', 'Ilha com base metálica, gavetas de madeira e tampo espaçoso.', 1420.00, 'images/IlhaCozinha.png', 1, 4),
('Cristaleira Industrial', 'Cristaleira com estrutura de ferro preto e portas de vidro, ideal para expor utensílios e bebidas.', 1140.00, 'images/CristaleiraIndustrial.png', 2, 4);

-- Quarto (ID 5)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Cama de Casal Industrial', 'Cama com estrutura de ferro e cabeceira de madeira rústica.', 980.00, 'images/CamaCasal.png', 2, 5),
('Criado-Mudo Industrial', 'Criado-mudo com estrutura metálica e gaveta em madeira de demolição.', 325.00, 'images/CriadoMudo.png', 6, 5),
('Guarda-Roupa Industrial', 'Guarda-roupa com portas de correr em madeira e estrutura de aço preto.', 1670.00, 'images/GuardaRoupa.png', 1, 5),
('Penteadeira Industrial', 'Penteadeira com tampo de madeira e estrutura metálica, espelho redondo com moldura de ferro.', 890.00, 'images/PenteadeiraIndustrial.png', 2, 5),
('Quarto Completo Industrial', 'Conjunto de quarto com cama, criado-mudo e guarda-roupa em estilo industrial.', 3500.00, 'images/Quarto.png', 1, 5); -- PRODUTO FALTANTE

-- Banheiro (ID 6)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Bancada para Banheiro Industrial', 'Bancada com cuba de apoio, estrutura metálica e prateleira inferior.', 689.00, 'images/BancadaBanheiro.png', 4, 6),
('Armário Suspenso Industrial', 'Armário de parede com moldura metálica e porta em madeira.', 290.00, 'images/ArmarioSuspenso.png', 7, 6),
('Espelho com Moldura de Ferro', 'Espelho retangular com moldura de ferro preto fosco.', 215.00, 'images/EspelhoFerro.png', 9, 6);

-- Armazenamento (ID 7)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Armário Multiuso Industrial', 'Armário vertical com estrutura de aço e prateleiras internas de madeira.', 589.00, 'images/ArmarioMultiuso.png', 5, 7),
('Gaveteiro Industrial', 'Gaveteiro com rodízios, estrutura metálica e gavetas em MDF rústico.', 374.00, 'images/Gaveteiro.png', 6, 7),
('Baú Industrial', 'Baú em aço preto com detalhes em madeira rústica e acabamento fosco.', 620.00, 'images/BauIndustrial.png', 5, 7),
('Prateleira Industrial (Multi-Uso)', 'Prateleira simples com estrutura em ferro e tábuas de madeira, perfeita para qualquer cômodo.', 199.00, 'images/Prateleira.png', 20, 7); -- PRODUTO FALTANTE

-- Decoração (ID 8)
INSERT INTO `produtos` (`nome`, `descricao`, `preco`, `imagem`, `estoque`, `categoria_id`) VALUES
('Luminária de Teto Industrial', 'Luminária pendente com cúpula de ferro e acabamento envelhecido.', 220.00, 'images/LuminariaTeto.png', 11, 8),
('Relógio de Parede Industrial', 'Relógio grande com estrutura metálica e estilo vintage industrial.', 185.00, 'images/RelogioParede.png', 10, 8),
('Quadro Decorativo Industrial', 'Quadro com moldura de ferro e arte em estilo urbano.', 149.00, 'images/QuadroIndustrial.png', 8, 8),
('Luminária de Mesa Industrial', 'Luminária de mesa com braço articulado e cúpula de metal, ideal para leitura.', 250.00, 'images/Luminaria.png', 15, 8); -- PRODUTO FALTANTE

-- --------------------------------------------------------
-- TABELA: Usuários (users)
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
);

-- Usuários de exemplo
INSERT INTO `users` (`name`, `email`, `password`) VALUES
('Administrador', 'admin@lojamoveis.com', '$2y$10$N9WOF0wo6kF/XJ0iXqXqMOu23qY50.Y2.kX5qK8r9p1Gk8i.lYq.G'),
('Cliente Teste', 'cliente@exemplo.com', '$2y$10$N9WOF0wo6kF/XJ0iXqXqMOu23qY50.Y2.kX5qK8r9p1Gk8i.lYq.G');

-- --------------------------------------------------------
-- TABELAS DE CARRINHO E PEDIDOS
-- --------------------------------------------------------

CREATE TABLE `carrinho` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `produto_id` INT,
  `quantidade` INT NOT NULL DEFAULT 1,
  `adicionado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`),
  UNIQUE KEY `usuario_produto` (`usuario_id`, `produto_id`)
);

CREATE TABLE `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `valor_total` DECIMAL(10, 2) NOT NULL,
  `data_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'Pendente',
  FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `itens_pedido` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT,
  `produto_id` INT,
  `quantidade` INT NOT NULL,
  `preco_unitario` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`),
  FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`)
);