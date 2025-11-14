<?php
// backend/login.php
require_once 'config.php'; 

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$response = ['success' => false, 'message' => '', 'user' => null, 'redirect' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email) || empty($password)) {
        $response['message'] = 'Por favor, preencha o e-mail e a senha.';
    } else {
        // Inclui o campo 'role' na consulta
        $sql = "SELECT id, name, email, password, role FROM users WHERE email = :email"; 
        
        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $email, PDO::PARAM_STR);
            if ($stmt->execute()) {
                if ($stmt->rowCount() == 1) {
                    if ($row = $stmt->fetch()) {
                        $id = $row["id"];
                        $name = $row["name"];
                        $role = $row["role"]; 
                        $hashed_password_from_db = $row["password"];

                        if (password_verify($password, $hashed_password_from_db)) {
                            // Iniciar sessão
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["name"] = $name;
                            $_SESSION["email"] = $email;
                            $_SESSION["role"] = $role; 

                            $response['success'] = true;
                            $response['message'] = 'Login bem-sucedido!';
                            
                            // Lógica de redirecionamento dinâmico
                            if ($role === 'admin') {
                                $response['redirect'] = '../backend/admin/dashboard.php'; 
                            } else {
                                $response['redirect'] = '../frontend/index.html'; 
                            }

                            $response['user'] = ['id' => $id, 'name' => $name, 'email' => $email, 'role' => $role];
                        } else {
                            $response['message'] = 'A senha que você digitou não é válida.';
                        }
                    }
                } else {
                    $response['message'] = 'Nenhuma conta encontrada com esse e-mail.';
                }
            } else {
                $response['message'] = 'Ops! Algo deu errado. Por favor, tente novamente mais tarde.';
            }
            unset($stmt);
        }
    }
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>