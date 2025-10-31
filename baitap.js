// Chỉ cho phép giáo viên upload file Word/PDF để tạo bài tập

// Xử lý sự kiện upload file
function handleBaiTapUpload(event) {
    event.preventDefault();
    if (!window.currentUser) {
        alert('Vui lòng đăng nhập để upload bài tập!'); // Bỏ "(Admin)"
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

// Update upload button visibility
function updateUploadButtons() {
    document.querySelectorAll('.upload-btn').forEach(btn => {
        btn.style.display = window.currentUser ? 'block' : 'none';
    });
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

// Add chat interface to exercise view
function addChatInterface(exerciseContainer) {
    const chatHtml = `
        <div class="chat-container" style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <div class="chat-box" style="height: 300px; overflow-y: auto; margin-bottom: 10px; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 8px;">
                <div class="chat-messages"></div>
            </div>
            <div class="chat-input" style="display: flex; gap: 10px;">
                <input type="text" class="chat-text" placeholder="Hỏi trợ lý AI..." style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white;">
                <button class="btn btn-primary ask-ai">Hỏi</button>
                <button class="btn btn-secondary get-hint">Gợi ý</button>
                <button class="btn btn-primary check-answer">Chấm bài</button>
            </div>
        </div>
    `;

    exerciseContainer.insertAdjacentHTML('beforeend', chatHtml);

    // Add event listeners
    const chatInput = exerciseContainer.querySelector('.chat-text');
    const chatMessages = exerciseContainer.querySelector('.chat-messages');
    const questionText = exerciseContainer.querySelector('.question-text').textContent;
    const answerInput = exerciseContainer.querySelector('.answer-input');

    exerciseContainer.querySelector('.ask-ai').onclick = async () => {
        if (!chatInput.value.trim()) return;

        // Add user message
        chatMessages.insertAdjacentHTML('beforeend', `
            <div class="chat-message user" style="margin-bottom: 10px; text-align: right;">
                <div style="background: rgba(0,212,255,0.2); display: inline-block; padding: 8px 12px; border-radius: 8px; max-width: 80%;">
                    ${chatInput.value}
                </div>
            </div>
        `);

        // Get AI response
        const response = await window.chatbot.sendMessage(chatInput.value, questionText);
        
        // Add AI message
        chatMessages.insertAdjacentHTML('beforeend', `
            <div class="chat-message bot" style="margin-bottom: 10px;">
                <div style="background: rgba(255,255,255,0.1); display: inline-block; padding: 8px 12px; border-radius: 8px; max-width: 80%;">
                    ${response}
                </div>
            </div>
        `);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    exerciseContainer.querySelector('.get-hint').onclick = async () => {
        const hint = await window.chatbot.getHint(questionText, answerInput.value);
        
        chatMessages.insertAdjacentHTML('beforeend', `
            <div class="chat-message bot" style="margin-bottom: 10px;">
                <div style="background: rgba(255,255,255,0.1); display: inline-block; padding: 8px 12px; border-radius: 8px; max-width: 80%;">
                    <strong>Gợi ý:</strong><br>${hint}
                </div>
            </div>
        `);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    exerciseContainer.querySelector('.check-answer').onclick = async () => {
        if (!answerInput.value.trim()) {
            alert('Vui lòng nhập câu trả lời trước khi chấm bài!');
            return;
        }

        const assessment = await window.chatbot.checkAnswer(
            questionText, 
            answerInput.value,
            exerciseContainer.dataset.correctAnswer
        );

        chatMessages.insertAdjacentHTML('beforeend', `
            <div class="chat-message bot" style="margin-bottom: 10px;">
                <div style="background: rgba(255,255,255,0.1); display: inline-block; padding: 8px 12px; border-radius: 8px; max-width: 80%;">
                    <strong>Đánh giá bài làm:</strong><br>${assessment}
                </div>
            </div>
        `);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
}

// Add to existing exercise rendering logic
function renderExercise(exercise) {
    // ...existing code...
    
    addChatInterface(exerciseContainer);
    
    // ...existing code...
}