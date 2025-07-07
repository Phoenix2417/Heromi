function getSettingText(key) {
    if (window.translations && window.currentLang && window.translations[window.currentLang]) {
        const t = window.translations[window.currentLang];
        return t[key] || key;
    }
    return key;
}

// Hiển thị giao diện cài đặt tài khoản
function renderAccountSetting() {
    const section = document.getElementById('section-setting');
    // Ẩn nút đăng nhập/đăng ký ở header
    if (window.loginBtn) window.loginBtn.style.display = 'none';
    if (window.registerBtn) window.registerBtn.style.display = 'none';
    // Hiện hai nút này ở cuối trang cài đặt
    let loginBtnClone = document.getElementById('loginBtn').cloneNode(true);
    let registerBtnClone = document.getElementById('registerBtn').cloneNode(true);
    loginBtnClone.style.display = '';
    registerBtnClone.style.display = '';
    loginBtnClone.onclick = window.loginBtn.onclick;
    registerBtnClone.onclick = window.registerBtn.onclick;
    // Xóa toàn bộ nội dung cài đặt, chỉ còn hai nút
    section.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;">
            <div style="margin-bottom:24px;font-size:18px;color:#00d4ff;font-weight:bold;">Vui lòng đăng nhập hoặc đăng ký để sử dụng các tính năng!</div>
            <div id="settingAuthBtns" style="display:flex;gap:18px;justify-content:center;">
            </div>
        </div>
    `;
    // Thêm hai nút vào cuối trang cài đặt
    const btnsDiv = section.querySelector('#settingAuthBtns');
    btnsDiv.appendChild(loginBtnClone);
    btnsDiv.appendChild(registerBtnClone);
}

// Khi chuyển sang tab cài đặt thì render lại
window.addEventListener('DOMContentLoaded', function () {
    const settingTab = document.querySelector('.nav-item[data-section="setting"]');
    if (settingTab) {
        settingTab.addEventListener('click', renderAccountSetting);
    }
    if (document.getElementById('section-setting').style.display !== 'none') {
        renderAccountSetting();
    }
});

// Nếu showSection được gọi từ nơi khác, cũng render lại nếu là setting
if (typeof window.showSection === 'function') {
    const origShowSection = window.showSection;
    window.showSection = function(section) {
        origShowSection(section);
        if (section === 'setting') renderAccountSetting();
    };
}

// Đảm bảo cập nhật lại khi đổi ngôn ngữ
if (window.setLang) {
    const origSetLang = window.setLang;
    window.setLang = function(lang) {
        origSetLang(lang);
        const settingSection = document.getElementById('section-setting');
        if (settingSection && settingSection.style.display !== 'none') renderAccountSetting();
    };
}
// Định nghĩa lại hàm renderAccountSetting với đầy đủ logic
function renderAccountSetting() {
    const section = document.getElementById('section-setting');
    // Nếu chưa đăng nhập
    if (!window.currentUser) {
        // Ẩn nút đăng nhập/đăng ký ở header
        if (window.loginBtn) window.loginBtn.style.display = 'none';
        if (window.registerBtn) window.registerBtn.style.display = 'none';
        // Hiện hai nút này ở cuối trang cài đặt
        let loginBtnClone = document.getElementById('loginBtn').cloneNode(true);
        let registerBtnClone = document.getElementById('registerBtn').cloneNode(true);
        loginBtnClone.style.display = '';
        registerBtnClone.style.display = '';
        loginBtnClone.onclick = window.loginBtn.onclick;
        registerBtnClone.onclick = window.registerBtn.onclick;
        // Xóa toàn bộ nội dung cài đặt, chỉ còn hai nút
        section.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;">
                <div style="margin-bottom:24px;font-size:18px;color:#00d4ff;font-weight:bold;">Vui lòng đăng nhập hoặc đăng ký để sử dụng các tính năng!</div>
                <div id="settingAuthBtns" style="display:flex;gap:18px;justify-content:center;">
                </div>
            </div>
        `;
        // Thêm hai nút vào cuối trang cài đặt
        const btnsDiv = section.querySelector('#settingAuthBtns');
        btnsDiv.appendChild(loginBtnClone);
        btnsDiv.appendChild(registerBtnClone);
        return;
    }

    // Nếu đã đăng nhập
    const user = window.currentUser;
    let isTeacher = user.role === 'teacher';
    let isStudent = user.role === 'student';
    let history = user.history || [];
    let countBT = 0, countDT = 0;
    let achievements = [];
    if (isTeacher) {
        // Đếm số bài tập và đề thi đã tạo (demo: dựa vào chuỗi)
        countBT = history.filter(h => h.startsWith('Tạo bài tập')).length;
        countDT = history.filter(h => h.startsWith('Tạo đề thi')).length;
        if (countBT + countDT >= 5) achievements.push('🌟 Giáo viên năng động');
        if (countBT + countDT >= 10) achievements.push('🏆 Giáo viên xuất sắc');
        if (countBT > 0 && countDT > 0) achievements.push('🧑‍🏫 Đa năng');
    }
    if (isStudent) {
        // Đếm số bài tập và đề thi đã làm (demo: dựa vào chuỗi)
        countBT = history.filter(h => h.startsWith('Làm bài')).length;
        countDT = history.filter(h => h.startsWith('Làm đề thi')).length;
        if (countBT + countDT >= 5) achievements.push('🌟 Học sinh chăm chỉ');
        if (countBT + countDT >= 10) achievements.push('🏆 Học sinh xuất sắc');
        if (countBT > 0 && countDT > 0) achievements.push('🎯 Đa tài');
    }
    // Giao diện
    section.innerHTML = `
    <h2>${getSettingText('setting_title') || 'Cài đặt tài khoản'}</h2>
    <form id="settingProfileForm" style="margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
            <img id="settingAvatarPreview" src="${user.avatar ? user.avatar : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username)}" alt="avatar" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #00d4ff;">
            <div>
                <label for="settingAvatar">${getSettingText('setting_avatar') || 'Ảnh đại diện'}</label>
                <input type="file" id="settingAvatar" accept="image/*" style="margin-top:4px;">
            </div>
        </div>
        <label for="settingFullname">${getSettingText('setting_fullname') || 'Họ tên'}</label>
        <input type="text" id="settingFullname" value="${user.fullname || ''}" placeholder="${getSettingText('setting_fullname_placeholder') || 'Nhập họ tên'}">
        <label for="settingEmail">${getSettingText('setting_email') || 'Email'}</label>
        <input type="email" id="settingEmail" value="${user.email || ''}" placeholder="${getSettingText('setting_email_placeholder') || 'Nhập email'}">
        <button class="btn btn-primary" type="submit" style="margin-top:10px;">${getSettingText('setting_update_btn') || 'Cập nhật thông tin'}</button>
        <div id="settingProfileMsg" style="margin-top:8px;font-size:13px;"></div>
    </form>
    <div style="margin-bottom:18px;">
        <b>${getSettingText('setting_role') || 'Chức vụ'}:</b> ${user.role}
        <br>
        ${isTeacher ? `<b>${getSettingText('setting_created_ex') || 'Số bài tập đã tạo'}:</b> ${countBT} <br><b>${getSettingText('setting_created_exam') || 'Số đề thi đã tạo'}:</b> ${countDT}` : ''}
        ${isStudent ? `<b>${getSettingText('setting_done_ex') || 'Số bài tập đã làm'}:</b> ${countBT} <br><b>${getSettingText('setting_done_exam') || 'Số đề thi đã làm'}:</b> ${countDT}` : ''}
        ${achievements.length ? `<div style="margin-top:8px;"><b>${getSettingText('setting_achievements') || 'Thành tựu'}:</b> ${achievements.join(' , ')}</div>` : ''}
    </div>
    <div style="margin-bottom:18px;">
        <button class="btn btn-secondary" id="settingLogoutBtn">${getSettingText('setting_logout') || 'Đăng xuất'}</button>
        <button class="btn" id="settingDeleteBtn" style="background:#fff;color:#ee5a24;border:1px solid #ee5a24;margin-left:10px;">${getSettingText('setting_delete') || 'Yêu cầu xóa tài khoản'}</button>
    </div>
    <div id="settingDeleteMsg" style="font-size:13px;color:#ee5a24;"></div>
    `;
    // Sự kiện cập nhật thông tin cá nhân
    document.getElementById('settingProfileForm').onsubmit = function(e) {
        e.preventDefault();
        const fullname = document.getElementById('settingFullname').value.trim();
        const email = document.getElementById('settingEmail').value.trim();
        user.fullname = fullname;
        user.email = email;
        document.getElementById('settingProfileMsg').textContent = 'Cập nhật thành công!';
        if (typeof showUserProfile === 'function') showUserProfile();
    };
    // Sự kiện upload avatar
    document.getElementById('settingAvatar').onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            document.getElementById('settingAvatarPreview').src = evt.target.result;
            user.avatar = evt.target.result;
            if (typeof showUserProfile === 'function') showUserProfile();
        };
        reader.readAsDataURL(file);
    };
    // Đăng xuất
    document.getElementById('settingLogoutBtn').onclick = function() {
        window.currentUser = null;
        if (typeof showUserProfile === 'function') showUserProfile();
        renderAccountSetting();
    };
    // Yêu cầu xóa tài khoản (gửi về email người dùng)
    document.getElementById('settingDeleteBtn').onclick = function() {
        if (!user.email) {
            document.getElementById('settingDeleteMsg').textContent = 'Vui lòng cập nhật email trước khi gửi yêu cầu xóa tài khoản.';
            return;
        }
        // Demo: chỉ hiển thị thông báo, thực tế sẽ gửi email/xử lý backend
        document.getElementById('settingDeleteMsg').textContent = `Yêu cầu xóa tài khoản đã được gửi về email: ${user.email}. Vui lòng kiểm tra hộp thư để xác nhận.`;
    };
}

// Tự động render khi chuyển sang tab cài đặt
window.addEventListener('DOMContentLoaded', function () {
    const settingTab = document.querySelector('.nav-item[data-section="setting"]');
    if (settingTab) {
        settingTab.addEventListener('click', renderAccountSetting);
    }
    // Nếu đang ở tab setting khi load lại
    if (document.getElementById('section-setting').style.display !== 'none') {
        renderAccountSetting();
    }
});

// Nếu showSection được gọi từ nơi khác, cũng render lại nếu là setting
if (typeof window.showSection === 'function') {
    const origShowSection = window.showSection;
    window.showSection = function(section) {
        origShowSection(section);
        if (section === 'setting') renderAccountSetting();
    };
}

// Đảm bảo cập nhật lại khi đổi ngôn ngữ
if (window.setLang) {
    const origSetLang = window.setLang;
    window.setLang = function(lang) {
        origSetLang(lang);
        // Nếu đang ở tab cài đặt thì cập nhật lại giao diện
        const settingSection = document.getElementById('section-setting');
        if (settingSection && settingSection.style.display !== 'none') renderAccountSetting();
    };
}
