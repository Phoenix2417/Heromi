const AuthService = require('./auth');

class UploadHandler {
  static validateFile(file, allowedTypes, maxSizeMB = 5) {
    if (!file) {
      throw new Error('Vui lòng chọn file');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Chỉ chấp nhận file types: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File không được vượt quá ${maxSizeMB}MB`);
    }

    return true;
  }

  static handleBaiTapUpload(event) {
    event.preventDefault();
    try {
      if (!AuthService.isTeacher(window.currentUser)) {
        throw new Error('Chỉ giáo viên mới được phép upload bài tập');
      }

      const fileInput = document.getElementById('baitapFile');
      const file = fileInput.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      this.validateFile(file, allowedTypes);
      
      // Xử lý upload
      alert('Đã upload file: ' + file.name);
      fileInput.value = '';
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }

  // Các hàm upload khác tương tự...
}

module.exports = UploadHandler;