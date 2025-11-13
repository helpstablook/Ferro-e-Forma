<?php
require_once 'config.php';

$category_filter = isset($_GET['category']) ? trim($_GET['category']) : '';
$response = ['success' => false, 'products' => [], 'message' => '']; // Inicializar a resposta é bom

try {
    // Usando nomes de tabelas e colunas do SQL: produtos, categorias, nome, descricao, imagem
    $sql = "SELECT p.id, p.nome, p.descricao, p.preco, p.imagem, c.nome as category_name
            FROM produtos p
            JOIN categorias c ON p.categoria_id = c.id";

    $params = [];
    if (!empty($category_filter) && $category_filter !== 'todos') { 
        $sql .= " WHERE c.nome = :category_name"; 
        $params[':category_name'] = $category_filter;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //  Adicione este bloco para gerenciar sucesso/falha de busca
    if ($products) {
        $response['success'] = true;
        $response['products'] = $products;
    } else {
        $response['success'] = true; // Se não houver produtos, não é um erro, é apenas uma lista vazia
        $response['message'] = 'Nenhum produto encontrado.';
    }


} catch (PDOException $e) {
    // Tratamento de erro do banco de dados
    $response['message'] = 'Erro ao buscar produtos: ' . $e->getMessage();
}

//  Retorno final: Apenas um bloco JSON
header('Content-Type: application/json');
echo json_encode($response);
unset($pdo);
exit; 
?>