<?php
// backend/admin/check_admin.php 

// Garante que a sessão está iniciada
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Verifica se o usuário está logado E se possui a permissão 'admin'
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true || $_SESSION["role"] !== 'admin') {
    // Redireciona para o login na pasta frontend
    header("location: ../../frontend/login.html");
    exit;
}

// O acesso é permitido, inclui a configuração do BD
require_once '../config.php';
?>