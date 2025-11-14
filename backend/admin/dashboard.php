<?php
// backend/admin/dashboard.php
require_once 'check_admin.php'; // Protege a página

$pageTitle = "Painel de Administração";
$adminName = $_SESSION["name"];

// Busca a contagem de produtos e pedidos
try {
    $totalProductsStmt = $pdo->query("SELECT COUNT(id) FROM produtos");
    $totalProducts = $totalProductsStmt->fetchColumn();

    $totalOrdersStmt = $pdo->query("SELECT COUNT(id) FROM pedidos WHERE status = 'Pendente'");
    $totalPendingOrders = $totalOrdersStmt->fetchColumn();
    
} catch(PDOException $e) {
    $totalProducts = "Erro BD";
    $totalPendingOrders = "Erro BD";
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title><?php echo $pageTitle; ?> | Ferro e Forma</title>
    <style>
        /* CSS Básico para Admin */
        body { font-family: sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
        .sidebar { width: 250px; background-color: #2c3e50; color: white; height: 100vh; position: fixed; padding-top: 20px; }
        .content { margin-left: 250px; padding: 20px; }
        .sidebar a { display: block; padding: 15px; text-decoration: none; color: #ecf0f1; border-bottom: 1px solid #34495e; }
        .sidebar a:hover { background-color: #34495e; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .card h3 { margin-top: 0; color: #3498db; }
        .stats { display: flex; gap: 20px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>Ferro e Forma Admin</h2>
        <p style="padding: 10px 15px;">Olá, <?php echo htmlspecialchars($adminName); ?></p>
        <a href="dashboard.php">Dashboard</a>
        <a href="products_manage.php">Gerenciar Produtos</a>
        <a href="content_manage.php">Gerenciar Conteúdo</a>
        <a href="../logout.php">Sair</a>
    </div>

    <div class="content">
        <h1>Dashboard Principal</h1>
        
        <div class="stats">
            <div class="card" style="flex: 1;">
                <h3>Total de Produtos Ativos</h3>
                <p style="font-size: 2em; font-weight: bold;"><?php echo $totalProducts; ?></p>
            </div>
            <div class="card" style="flex: 1;">
                <h3>Pedidos Pendentes</h3>
                <p style="font-size: 2em; color: #e74c3c; font-weight: bold;"><?php echo $totalPendingOrders; ?></p>
            </div>
            <div class="card" style="flex: 1;">
                <h3>Configurações de CMS</h3>
                <p style="font-size: 1.2em;">Gerencie textos e novidades.</p>
            </div>
        </div>
        
        <h2>Próxima Etapa:</h2>
        <p>Implementar o gerenciamento de produtos no arquivo <code>products_manage.php</code>.</p>
    </div>
</body>
</html>