// Chỉ cho phép giáo viên upload file Excel để quản lý học sinh

function isTeacher(user) {
    return user && user.role === 'Giáo viên';
}

function handleQLHSUpload(event) {
    event.preventDefault();
    if (!window.currentUser || !isTeacher(window.currentUser)) {
        alert('Chỉ giáo viên mới được phép upload danh sách học sinh!');
        return false;
    }
    const fileInput = document.getElementById('qlhsFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('Vui lòng chọn file!');
        return false;
    }
    const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file Excel (.xls, .xlsx)!');
        return false;
    }
    // Xử lý upload (demo: chỉ hiển thị tên file)
    alert('Đã upload danh sách học sinh: ' + file.name);
    // TODO: Gửi file lên server hoặc xử lý tiếp theo ở đây
    fileInput.value = '';
    return false;
}

window.addEventListener('DOMContentLoaded', function () {
    // Hiển thị form upload trong giao diện riêng nếu có
    const qlhsArea = document.getElementById('qlhsUploadArea');
    const qlhsForm = document.getElementById('qlhsUploadForm');
    if (qlhsArea && qlhsForm) {
        qlhsArea.appendChild(qlhsForm);
    }
});
