// Danh sách đề thi/bài tập public (demo)
const publicQuestions = [];

function getNHCHText(key) {
    if (window.translations && window.currentLang && window.translations[window.currentLang]) {
        const t = window.translations[window.currentLang];
        return t[key] || key;
    }
    return key;
}

// Hàm render chính cho ngân hàng câu hỏi
function renderNHCH() {
    const section = document.getElementById('section-ngan-hang-cau-hoi');
    if (!section) return;

    // Đảm bảo menu item được highlight
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === 'ngan-hang-cau-hoi') {
            item.classList.add('active');
        }
    });

    // Ẩn dashboard grid và hiện section ngân hàng câu hỏi
    const dashboardGrid = document.getElementById('dashboardGrid');
    if (dashboardGrid) dashboardGrid.style.display = 'none';

    // Hiển thị section ngân hàng câu hỏi
    section.style.display = 'block';

    // Render nội dung
    let html = `
    <button class="btn btn-secondary back-home-btn" style="margin-bottom:18px;">← Trở về trang chủ</button>
    <h2>${getNHCHText('Ngân hàng câu hỏi') || 'nhch_title'}</h2>
    <form id="nhchFilterForm" style="display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;margin-bottom:18px;background:rgba(30,60,114,0.9);padding:15px 20px;border-radius:12px;">
        <div>
            <label style="font-size:14px;color:#fff;display:block;margin-bottom:4px;">Thời gian tải lên:</label>
            <select id="nhchFilterTime" style="padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);background:rgba(0, 61, 191, 1);color:#fff;">
                <option value="" style="background:rgba(0, 61, 191, 1);">Tất cả</option>
                <option value="today" style="background:rgba(0, 61, 191, 1);">Hôm nay</option>
                <option value="week" style="background:rgba(0, 61, 191, 1);">7 ngày qua</option>
                <option value="month" style="background:rgba(0, 61, 191, 1);">30 ngày qua</option>
                <option value="year" style="background:rgba(0, 61, 191, 1);">1 năm qua</option>
            </select>
        </div>
        <div>
            <label style="font-size:14px;color:#fff;display:block;margin-bottom:4px;">Lớp:</label>
            <select id="nhchFilterClass" style="padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);background:rgba(0, 61, 191, 1);color:#fff;">
                <option value="" style="background:rgba(0, 61, 191, 1);">Tất cả</option>
                <option value="1" style="background:rgba(0, 61, 191, 1);">Lớp 1</option>
                <option value="2" style="background:rgba(0, 61, 191, 1);">Lớp 2</option>
                <option value="3" style="background:rgba(0, 61, 191, 1);">Lớp 3</option>
                <option value="4" style="background:rgba(0, 61, 191, 1);">Lớp 4</option>
                <option value="5" style="background:rgba(0, 61, 191, 1);">Lớp 5</option>
                <option value="6" style="background:rgba(0, 61, 191, 1);">Lớp 6</option>
                <option value="7" style="background:rgba(0, 61, 191, 1);">Lớp 7</option>
                <option value="8" style="background:rgba(0, 61, 191, 1);">Lớp 8</option>
                <option value="9" style="background:rgba(0, 61, 191, 1);">Lớp 9</option>
                <option value="10" style="background:rgba(0, 61, 191, 1);">Lớp 10</option>
                <option value="11" style="background:rgba(0, 61, 191, 1);">Lớp 11</option>
                <option value="12" style="background:rgba(0, 61, 191, 1);">Lớp 12</option>
            </select>
        </div>
        <div>
            <label style="font-size:14px;color:#fff;display:block;margin-bottom:4px;">Môn học:</label>
            <select id="nhchFilterSubject" style="padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);background:rgba(0, 61, 191, 1);color:#fff;">
                <option value="" style="background:rgba(0, 61, 191, 1);">Tất cả</option>
                <option value="toan" style="background:rgba(0, 61, 191, 1);">Toán</option>
                <option value="vatly" style="background:rgba(0, 61, 191, 1);">Vật lý</option>
                <option value="hoahoc" style="background:rgba(0, 61, 191, 1);">Hóa học</option>
                <option value="sinhhoc" style="background:rgba(0, 61, 191, 1);">Sinh học</option>
                <option value="tienganh" style="background:rgba(0, 61, 191, 1);">Tiếng Anh</option>
                <option value="tiengphap" style="background:rgba(0, 61, 191, 1);">Tiếng Pháp</option>
                <option value="tienghan" style="background:rgba(0, 61, 191, 1);">Tiếng Hàn</option>
                <option value="tiengnhat" style="background:rgba(0, 61, 191, 1);">Tiếng Nhật</option>
                <option value="tiengduc" style="background:rgba(0, 61, 191, 1);">Tiếng Đức</option>
                <option value="tiengtrung" style="background:rgba(0, 61, 191, 1);">Tiếng Trung</option>
                <option value="tiengnga" style="background:rgba(0, 61, 191, 1);">Tiếng Nga</option>
                <option value="gdcd" style="background:rgba(0, 61, 191, 1);">Giáo dục công dân</option>
                <option value="ktpl" style="background:rgba(0, 61, 191, 1);">Giáo dục kinh tế & pháp luật</option>
                <option value="tin" style="background:rgba(0, 61, 191, 1);">Tin học</option>
                <option value="van" style="background:rgba(0, 61, 191, 1);">Ngữ văn</option>
                <option value="lichsu" style="background:rgba(0, 61, 191, 1);">Lịch sử</option>
                <option value="dialy" style="background:rgba(0, 61, 191, 1);">Địa lý</option>
            </select>
        </div>
        <div style="align-self:flex-end;">
            <button type="submit" class="btn btn-primary" style="padding:6px 18px;font-size:14px;margin-bottom:1px;">Tìm kiếm</button>
        </div>
    </form>
    `;
    if (publicQuestions.length === 0) {
        html += `<div>${getNHCHText('Chưa có đề thi hoặc bài tập nào được chia sẻ công khai.') || 'nhch_empty'}</div>`;
    } else {
        html += `<div style="margin-bottom:18px;font-size:14px;color:#888;">${getNHCHText('Bạn có thể xem, tải về hoặc sử dụng các đề thi/bài tập được chia sẻ công khai bởi người dùng khác.') || 'nhch_desc'}</div>`;
        html += `<div style="display:flex;flex-direction:column;gap:18px;">`;
        publicQuestions.forEach(q => {
            html += `
            <div style="background:rgba(0, 61, 191, 1);border-radius:12px;padding:18px 20px;box-shadow:0 2px 8px rgba(30,60,114,0.07);display:flex;flex-direction:column;gap:6px;">
                <div style="font-size:17px;font-weight:600;">${q.title} <span style="font-size:13px;color:#00d4ff;">(${getNHCHText(q.type === 'Bài tập' ? 'exercise' : 'exam')})</span></div>
                <div style="font-size:13px;color:#bbb;">${getNHCHText('Tác giả') || 'nhch_author'}: ${q.author} | ${getNHCHText('Ngày đăng') || 'nhch_date'}: ${q.date}</div>
                <div style="font-size:14px;">${q.description}</div>
                <div style="margin-top:8px;">
                    <a href="${q.fileUrl}" class="btn btn-primary" style="font-size:13px;padding:6px 16px;" download>${getNHCHText('Xem/Tải về') || 'nhch_download'}</a>
                    <button class="btn btn-secondary" style="font-size:13px;padding:6px 16px;margin-left:8px;" onclick="usePublicQuestion(${q.id})">${getNHCHText('Sử dụng') || 'nhch_use'}</button>
                </div>
            </div>
            `;
        });
        html += `</div>`;
    }
    section.innerHTML = html;

    // Xử lý nút trở về
    const backBtn = section.querySelector('.back-home-btn');
    if (backBtn) {
        backBtn.onclick = function() {
            // Hiện lại dashboard grid
            if (dashboardGrid) dashboardGrid.style.display = 'grid';
            // Ẩn section hiện tại
            section.style.display = 'none';
            // Bỏ active trên menu
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        };
    }

    // Xử lý form lọc
    const filterForm = document.getElementById('nhchFilterForm');
    if (filterForm) {
        filterForm.onsubmit = function(e) {
            e.preventDefault();
            alert('Tính năng lọc sẽ được cập nhật sau!');
        };
    }
}

// Xử lý khi người dùng muốn sử dụng/copy đề/bài tập về tài khoản cá nhân
function usePublicQuestion(id) {
    const q = publicQuestions.find(q => q.id === id);
    if (!q) return;
    // Demo: chỉ alert, thực tế sẽ copy về tài khoản hoặc mở popup
    alert(`Bạn đã chọn sử dụng "${q.title}".\nTính năng này sẽ sao chép đề/bài tập vào tài khoản của bạn (demo).`);
}

// Xử lý click từ cả dashboard card và menu item
function handleNHCHNavigation() {
    // Ẩn tất cả section khác
    document.querySelectorAll('.section-content').forEach(el => {
        el.style.display = 'none';
    });
    
    // Render NHCH
    renderNHCH();
}

// Event listeners
window.addEventListener('DOMContentLoaded', function () {
    // Xử lý click từ menu
    const nhchTab = document.querySelector('.nav-item[data-section="ngan-hang-cau-hoi"]');
    if (nhchTab) {
        nhchTab.addEventListener('click', handleNHCHNavigation);
    }

    // Xử lý click từ dashboard card
    const nhchCard = document.querySelector('.card[onclick*="ngan-hang-cau-hoi"]');
    if (nhchCard) {
        nhchCard.onclick = handleNHCHNavigation;
    }

    // Kiểm tra nếu đang ở section này khi load trang
    if (document.getElementById('section-ngan-hang-cau-hoi').style.display !== 'none') {
        handleNHCHNavigation();
    }
});

// Tích hợp với hàm showSection toàn cục nếu có
if (typeof window.showSection === 'function') {
    const origShowSection = window.showSection;
    window.showSection = function(section) {
        if (section === 'ngan-hang-cau-hoi') {
            handleNHCHNavigation();
        } else {
            origShowSection(section);
        }
    };
}

// Đảm bảo cập nhật lại khi đổi ngôn ngữ
if (window.setLang) {
    const origSetLang = window.setLang;
    window.setLang = function(lang) {
        origSetLang(lang);
        // Nếu đang ở tab ngân hàng câu hỏi thì cập nhật lại giao diện
        const nhchSection = document.getElementById('section-ngan-hang-cau-hoi');
        if (nhchSection && nhchSection.style.display !== 'none') renderNHCH();
    };
}
