<?php
require_once 'config/database.php';
require_once 'config/auth.php';
session_start();

// Check login status
$isLoggedIn = isset($_SESSION['user']);
$currentUser = $isLoggedIn ? $_SESSION['user'] : null;
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Heromi - Trang học liệu miễn phí</title>
    <link rel="icon" type="image/x-icon" href="/assets/heromi.ico">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <?php include 'templates/header.php'; ?>
    <?php include 'templates/sidebar.php'; ?>
    
    <section id="dashboard" class="page-section">
        <div class="container">
            <div class="main-content">
                <?php include 'templates/dashboard-header.php'; ?>
                <?php include 'templates/dashboard-grid.php'; ?>
                <?php 
                // Include các section content
                $sections = ['bai-tap', 'de-thi', 'ngan-hang-cau-hoi', 'de-xuat-tinh-nang', 'setting'];
                foreach($sections as $section) {
                    include "templates/sections/$section.php";
                }
                ?>
            </div>
        </div>
    </section>

    <?php include 'templates/auth-popups.php'; ?>
    
    <!-- Scripts -->
    <script src="js/main.js"></script>
    <script src="js/baitap.js"></script>
    <script src="js/dethi.js"></script>
    <script src="js/qlhs.js"></script>
    <script src="js/setting.js"></script>
    <script src="js/nhch.js"></script>
</body>
</html>
