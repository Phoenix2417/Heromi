// Danh sách đề thi/bài tập public (demo)
const publicQuestions = [];

function getNHCHText(key) {
    if (window.translations && window.currentLang && window.translations[window.currentLang]) {
        const t = window.translations[window.currentLang];
        return t[key] || key;
    }
    return key;
}

// Render giao diện ngân hàng câu hỏi
function renderNHCH() {
    const section = document.getElementById('section-ngan-hang-cau-hoi');
    if (!section) return;
    let html = `
    <h2>${getNHCHText('Ngân hàng câu hỏi') || 'nhch_title'}</h2>
    <form id="nhchFilterForm" style="display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;margin-bottom:18px;">
        <div>
            <label style="font-size:14px;">Thời gian tải lên:</label>
            <select id="nhchFilterTime" style="padding:4px 10px;border-radius:6px;">
                <option value="">Tất cả</option>
                <option value="today">Hôm nay</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
                <option value="year">1 năm qua</option>
            </select>
        </div>
        <div>
            <label style="font-size:14px;">Lớp:</label>
            <select id="nhchFilterClass" style="padding:4px 10px;border-radius:6px;">
                <option value="">Tất cả</option>
                <option value="1">Lớp 1</option>
                <option value="2">Lớp 2</option>
                <option value="3">Lớp 3</option>
                <option value="4">Lớp 4</option>
                <option value="5">Lớp 5</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
            </select>
        </div>
        <div>
            <label style="font-size:14px;">Môn học:</label>
            <select id="nhchFilterSubject" style="padding:4px 10px;border-radius:6px;">
                <option value="">Tất cả</option>
                <option value="toan">Toán</option>
                <option value="vatly">Vật lý</option>
                <option value="hoahoc">Hóa học</option>
                <option value="sinhhoc">Sinh học</option>
                <option value="tienganh">Tiếng Anh</option>
                <option value="tiengphap">Tiếng Pháp</option>
                <option value="tienghan">Tiếng Hàn</option>
                <option value="tiengnhat">Tiếng Nhật</option>
                <option value="tiengduc">Tiếng Đức</option>
                <option value="tiengtrung">Tiếng Trung</option>
                <option value="tiengnga">Tiếng Nga</option>
                <option value="gdcd">Giáo dục công dân</option>
                <option value="ktpl">Giáo dục kinh tế & pháp luật</option>
                <option value="tin">Tin học</option>
                <option value="van">Ngữ văn</option>
                <option value="lichsu">Lịch sử</option>
                <option value="dialy">Địa lý</option>
                <!-- Thêm các môn khác nếu cần -->
            </select>
        </div>
        <button type="submit" class="btn btn-primary" style="padding:6px 18px;font-size:14px;">Tìm kiếm</button>
    </form>
    `;
    if (publicQuestions.length === 0) {
        html += `<div>${getNHCHText('Chưa có đề thi hoặc bài tập nào được chia sẻ công khai.') || 'nhch_empty'}</div>`;
    } else {
        html += `<div style="margin-bottom:18px;font-size:14px;color:#888;">${getNHCHText('Bạn có thể xem, tải về hoặc sử dụng các đề thi/bài tập được chia sẻ công khai bởi người dùng khác.') || 'nhch_desc'}</div>`;
        html += `<div style="display:flex;flex-direction:column;gap:18px;">`;
        publicQuestions.forEach(q => {
            html += `
            <div style="background:rgba(255,255,255,0.08);border-radius:12px;padding:18px 20px;box-shadow:0 2px 8px rgba(30,60,114,0.07);display:flex;flex-direction:column;gap:6px;">
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

    // Gắn sự kiện submit cho form lọc (chỉ demo, chưa lọc dữ liệu)
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

// Tự động render khi chuyển sang tab ngân hàng câu hỏi
window.addEventListener('DOMContentLoaded', function () {
    const nhchTab = document.querySelector('.nav-item[data-section="ngan-hang-cau-hoi"]');
    if (nhchTab) {
        nhchTab.addEventListener('click', renderNHCH);
    }
    // Nếu đang ở tab này khi load lại
    if (document.getElementById('section-ngan-hang-cau-hoi').style.display !== 'none') {
        renderNHCH();
    }
});

// Nếu showSection được gọi từ nơi khác, cũng render lại nếu là ngân hàng câu hỏi
if (typeof window.showSection === 'function') {
    const origShowSection = window.showSection;
    window.showSection = function(section) {
        origShowSection(section);
        if (section === 'ngan-hang-cau-hoi') renderNHCH();
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
