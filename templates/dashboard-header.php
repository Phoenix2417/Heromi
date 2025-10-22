<div class="header">
    <div class="header-left">
        <h1 id="mainTitle" data-i18n="dashboard_title">Trang chủ</h1>
    </div>
    <div class="header-right">
        <?php if(!$isLoggedIn): ?>
            <a href="#" class="btn btn-primary" id="loginBtn" data-i18n="loginBtn">Đăng nhập</a>
            <a href="#" class="btn btn-secondary" id="registerBtn" data-i18n="registerBtn">Đăng ký</a>
        <?php else: ?>
            <div class="user-profile" id="userProfile">
                <div class="user-avatar" id="userAvatar"><?= substr($currentUser['username'], 0, 1) ?></div>
                <div class="user-info" id="userInfo">
                    <div class="user-fullname" id="userFullname"><?= $currentUser['username'] ?></div>
                    <div class="user-history" id="userHistory"></div>
                </div>
                <form method="post" action="logout.php" style="display:inline;">
                    <button type="submit" class="btn btn-secondary" style="margin-left:10px">Đăng xuất</button>
                </form>
            </div>
        <?php endif; ?>
    </div>
</div>
