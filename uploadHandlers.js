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

  static async handleFileUpload(file, type) {
    // Demo upload progress
    return new Promise((resolve, reject) => {
      const progress = document.createElement('div');
      progress.className = 'upload-progress';
      document.body.appendChild(progress);
      
      let percent = 0;
      const interval = setInterval(() => {
        percent += 10;
        progress.style.width = percent + '%';
        
        if (percent >= 100) {
          clearInterval(interval);
          progress.remove();
          resolve({
            url: URL.createObjectURL(file),
            filename: file.name
          });
        }
      }, 200);
    });
  }

  static async handleUpload(event, type) {
    event.preventDefault();
    
    try {
      if (!window.currentUser) {
        throw new Error('Vui lòng đăng nhập để upload file');
      }

      const fileInput = event.target.querySelector('input[type="file"]');
      const file = fileInput.files[0];
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      this.validateFile(file, allowedTypes);
      
      const result = await this.handleFileUpload(file, type);
      
      alert(`Upload thành công: ${result.filename}`);
      fileInput.value = '';
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }
}

module.exports = UploadHandler;