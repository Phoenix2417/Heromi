<?php
require_once 'database.php';

class Auth {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function login($username, $password) {
        $query = "SELECT * FROM users WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $user['password'])) {
                $_SESSION['user'] = $user;
                return true;
            }
        }
        return false;
    }

    public function register($data) {
        $query = "INSERT INTO users SET
                username = :username,
                email = :email,
                password = :password,
                role = :role";
                
        $stmt = $this->conn->prepare($query);
        
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt->bindParam(':username', $data['username']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':password', $password_hash);
        $stmt->bindParam(':role', $data['role']);
        
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
