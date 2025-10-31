<?php
// Deprecated server-side file. Redirect to index.html which now embeds the client-side auth.
header("Location: /index.html", true, 302);
exit;
require_once 'database.php';

class Auth {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function login($username, $password) {
        $query = "SELECT * FROM nguoi_dung WHERE ten = :ten LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":ten", $username);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $user['matkhau'])) {
                $_SESSION['user'] = $user;
                return true;
            }
        }
        return false;
    }

    public function register($data) {
        $query = "INSERT INTO nguoi_dung SET
                ten = :ten,
                email = :email,
                matkhau = :matkhau";
                
        $stmt = $this->conn->prepare($query);
        
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt->bindParam(':ten', $data['username']);
        $stmt->bindParam(':email', $data['email']); 
        $stmt->bindParam(':matkhau', $password_hash);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function isLoggedIn() {
        return isset($_SESSION['user']);
    }

    public function getCurrentUser() {
        return $_SESSION['user'] ?? null;
    }

    public function logout() {
        unset($_SESSION['user']);
        session_destroy();
    }
}
