// Chỉ cho phép giáo viên upload file Word/PDF để tạo bài tập

// Kiểm tra quyền giáo viên
function isTeacher(user) {
    return user && user.role === 'Giáo viên';
}

// Xử lý sự kiện upload file
function handleBaiTapUpload(event) {
    event.preventDefault();
    if (!window.currentUser || !isTeacher(window.currentUser)) {
        alert('Chỉ giáo viên mới được phép upload bài tập!');
        return false;
    }
    const fileInput = document.getElementById('baitapFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('Vui lòng chọn file!');
        return false;
    }
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file Word (.doc, .docx) hoặc PDF!');
        return false;
    }
    // Xử lý upload (demo: chỉ hiển thị tên file)
    alert('Đã upload file: ' + file.name);
    // TODO: Gửi file lên server hoặc xử lý tiếp theo ở đây
    fileInput.value = '';
    return false;
}

// Gắn sự kiện khi trang tải xong
window.addEventListener('DOMContentLoaded', function () {
    // Hiển thị form upload trong giao diện riêng nếu có
    const baitapArea = document.getElementById('baitapUploadArea');
    const baitapForm = document.getElementById('baitapUploadForm');
    if (baitapArea && baitapForm) {
        baitapArea.appendChild(baitapForm);
    }
});