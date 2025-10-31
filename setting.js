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


    // Lấy lịch sử hoạt động (demo)
    let history = [];
    if (window.userHistories && window.userHistories[user.username]) {
        history = window.userHistories[user.username].history || [];
    }

    // Lịch sử đã giải không phân biệt vai trò
    let exercises = history.filter(h => h.startsWith('Bài tập'));
    let exams = history.filter(h => h.startsWith('Đề thi'));

    // Dữ liệu demo cho biểu đồ hoạt động (theo ngày)
    // { '2024-06-01': 2, '2024-06-02': 1, ... }
    let activityData = {};
    history.forEach(h => {
        // Lấy ngày từ chuỗi, ví dụ: 'Làm bài: Toán lớp 6 - 02/06/2024'
        const dateMatch = h.match(/(\d{2}\/\d{2}\/\d{4})$/);
        if (dateMatch) {
            const [d, m, y] = dateMatch[1].split('/');
            const iso = `${y}-${m}-${d}`;
            activityData[iso] = (activityData[iso] || 0) + 1;
        }
    });
    // Lấy 7 ngày gần nhất
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().slice(0, 10);
        days.push(iso);
    }
    const chartData = days.map(day => activityData[day] || 0);

    section.innerHTML = `
    <h2>${getSettingText('Cài đặt tài khoản') || 'setting_title'}</h2>
    <div style="margin-bottom:18px;">
        <b>${getSettingText('Email') || 'setting_email'}:</b> ${user.email || ''}
    </div>
    <div style="margin-bottom:24px;">
        <b>Thành tựu:</b>
        <div style="margin-top:8px;">${achievements.length ? achievements.join(' , ') : 'Chưa có thành tựu'}</div>
    </div>
    <div style="margin-bottom:24px;">
        <b>Hoạt động đề thi:</b>
        <ul style="margin:8px 0 0 18px;">
            ${exams.length ? exams.map(e => `<li>${e}</li>`).join('') : '<li>Chưa có</li>'}
        </ul>
        <b>Hoạt động bài tập:</b>
        <ul style="margin:8px 0 0 18px;">
            ${exercises.length ? exercises.map(e => `<li>${e}</li>`).join('') : '<li>Chưa có</li>'}
        </ul>
    </div>
    <div style="margin-bottom:24px;">
        <b>Biểu đồ hoạt động 7 ngày gần nhất:</b>
        <canvas id="activityChart" width="420" height="180" style="background:#fff;border-radius:12px;margin-top:10px;max-width:100%;"></canvas>
    </div>
    <div style="margin-bottom:18px;">
        <button class="btn btn-secondary" id="settingLogoutBtn">${getSettingText('Đăng xuất') || 'setting_logout'}</button>
        <button class="btn" id="settingDeleteBtn" style="background:#fff;color:#ee5a24;border:1px solid #ee5a24;margin-left:10px;">${getSettingText('Yêu cầu xóa tài khoản') || 'setting_delete'}</button>
    </div>
    <div id="settingDeleteMsg" style="font-size:13px;color:#ee5a24;"></div>
    `;

    // Vẽ biểu đồ hoạt động đơn giản (dạng cột)
    const canvas = section.querySelector('#activityChart');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const max = Math.max(...chartData, 1);
        const barWidth = 38;
        const gap = 22;
        chartData.forEach((val, i) => {
            const x = 24 + i * (barWidth + gap);
            const y = canvas.height - 24 - (val / max) * 100;
            ctx.fillStyle = '#17bd0b';
            ctx.fillRect(x, y, barWidth, (val / max) * 100);
            ctx.fillStyle = '#1e3c72';
            ctx.font = '13px Segoe UI';
            ctx.textAlign = 'center';
            ctx.fillText(val, x + barWidth / 2, y - 6);
            ctx.save();
            ctx.translate(x + barWidth / 2, canvas.height - 6);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText(days[i].slice(5), 0, 0); // MM-DD
            ctx.restore();
        });
    }

    // Đăng xuất
    section.querySelector('#settingLogoutBtn').onclick = function() {
        window.currentUser = null;
        if (typeof showUserProfile === 'function') showUserProfile();
        renderAccountSetting();
    };
    // Yêu cầu xóa tài khoản
    section.querySelector('#settingDeleteBtn').onclick = function() {
        if (!user.email) {
            section.querySelector('#settingDeleteMsg').textContent = 'Vui lòng cập nhật email trước khi gửi yêu cầu xóa tài khoản.';
            return;
        }
        section.querySelector('#settingDeleteMsg').textContent = `Yêu cầu xóa tài khoản đã được gửi về email: ${user.email}. Vui lòng kiểm tra hộp thư để xác nhận.`;
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
