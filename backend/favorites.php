<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    echo json_encode(['success' => false, 'message' => 'Você precisa estar logado para gerenciar seus favoritos.', 'redirect' => 'login.html']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$user_id = $_SESSION['id'];

switch ($action) {
    case 'add':
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        if ($product_id > 0) {
            try {
                $sql = "INSERT INTO favoritos (usuario_id, produto_id) VALUES (:user_id, :product_id)";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
                $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Produto adicionado aos favoritos.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Erro ao adicionar produto aos favoritos.']);
                }
            } catch (PDOException $e) {
                echo json_encode(['success' => false, 'message' => 'Este produto já está na sua lista de favoritos.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'ID de produto inválido.']);
        }
        break;

    case 'remove':
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        if ($product_id > 0) {
            try {
                $sql = "DELETE FROM favoritos WHERE usuario_id = :user_id AND produto_id = :product_id";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
                $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Produto removido dos favoritos.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Erro ao remover produto dos favoritos.']);
                }
            } catch (PDOException $e) {
                echo json_encode(['success' => false, 'message' => 'Erro no banco de dados.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'ID de produto inválido.']);
        }
        break;

    case 'view':
        try {
            $sql = "SELECT p.id, p.nome, p.preco, p.imagem FROM favoritos f JOIN produtos p ON f.produto_id = p.id WHERE f.usuario_id = :user_id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'favoritos' => $favoritos]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Erro ao buscar favoritos: ' . $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida.']);
        break;
}
unset($pdo);
?>