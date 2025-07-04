// Danh sách đề thi/bài tập public (demo)
const publicQuestions = [
    {
        id: 1,
        type: 'Bài tập',
        title: 'Bài tập Toán lớp 6 - Số học',
        author: 'Nguyễn Văn A',
        date: '2024-06-10',
        description: 'Bài tập số học cơ bản cho học sinh lớp 6.',
        fileUrl: '#'
    },
    {
        id: 2,
        type: 'Đề thi',
        title: 'Đề thi Vật lý lớp 7 - Học kỳ 2',
        author: 'Trần Thị B',
        date: '2024-06-09',
        description: 'Đề thi cuối kỳ môn Vật lý lớp 7.',
        fileUrl: '#'
    },
    {
        id: 3,
        type: 'Bài tập',
        title: 'Bài tập Tiếng Anh lớp 8 - Unit 5',
        author: 'Lê Văn C',
        date: '2024-06-08',
        description: 'Bài tập luyện tập từ vựng và ngữ pháp Unit 5.',
        fileUrl: '#'
    }
];

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
    let html = `<h2>${getNHCHText('nhch_title') || 'Ngân hàng câu hỏi'}</h2>`;
    if (publicQuestions.length === 0) {
        html += `<div>${getNHCHText('nhch_empty') || 'Chưa có đề thi hoặc bài tập nào được chia sẻ công khai.'}</div>`;
    } else {
        html += `<div style="margin-bottom:18px;font-size:14px;color:#888;">${getNHCHText('nhch_desc') || 'Bạn có thể xem, tải về hoặc sử dụng các đề thi/bài tập được chia sẻ công khai bởi người dùng khác.'}</div>`;
        html += `<div style="display:flex;flex-direction:column;gap:18px;">`;
        publicQuestions.forEach(q => {
            html += `
            <div style="background:rgba(255,255,255,0.08);border-radius:12px;padding:18px 20px;box-shadow:0 2px 8px rgba(30,60,114,0.07);display:flex;flex-direction:column;gap:6px;">
                <div style="font-size:17px;font-weight:600;">${q.title} <span style="font-size:13px;color:#00d4ff;">(${getNHCHText(q.type === 'Bài tập' ? 'exercise' : 'exam')})</span></div>
                <div style="font-size:13px;color:#bbb;">${getNHCHText('nhch_author') || 'Tác giả'}: ${q.author} | ${getNHCHText('nhch_date') || 'Ngày đăng'}: ${q.date}</div>
                <div style="font-size:14px;">${q.description}</div>
                <div style="margin-top:8px;">
                    <a href="${q.fileUrl}" class="btn btn-primary" style="font-size:13px;padding:6px 16px;" download>${getNHCHText('nhch_download') || 'Xem/Tải về'}</a>
                    <button class="btn btn-secondary" style="font-size:13px;padding:6px 16px;margin-left:8px;" onclick="usePublicQuestion(${q.id})">${getNHCHText('nhch_use') || 'Sử dụng'}</button>
                </div>
            </div>
            `;
        });
        html += `</div>`;
    }
    section.innerHTML = html;
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
