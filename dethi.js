// Chỉ cho phép giáo viên upload file Word/PDF để tạo đề thi

function handleDeThiUpload(event) {
    event.preventDefault();
    if (!window.currentUser) {
        alert('Vui lòng đăng nhập để upload đề thi!'); // Bỏ "(Admin)"
        return false;
    }
    const fileInput = document.getElementById('dethiFile');
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
    alert('Đã upload đề thi: ' + file.name);
    // TODO: Gửi file lên server hoặc xử lý tiếp theo ở đây
    fileInput.value = '';
    return false;
}

window.addEventListener('DOMContentLoaded', function () {
    // Hiển thị form upload trong giao diện riêng nếu có
    const dethiArea = document.getElementById('dethiUploadArea');
    const dethiForm = document.getElementById('dethiUploadForm');
    if (dethiArea && dethiForm) {
        dethiArea.appendChild(dethiForm);
    }
});
