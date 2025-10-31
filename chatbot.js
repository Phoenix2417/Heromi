class ChatBot {
    constructor() {
        this.API_KEY = process.env.GEMINI_API_KEY;
        this.API_URL = 'http://localhost/api/gemini';
        this.contextHistory = [];
    }

    async sendMessage(message, context = '') {
        try {
            // Add message to history
            this.contextHistory.push({ role: 'user', content: message });
            if (this.contextHistory.length > 10) this.contextHistory.shift();

            const response = await this.callGeminiAPI(message, context);
            
            // Add response to history
            this.contextHistory.push({ role: 'assistant', content: response });
            
            return response;
        } catch (error) {
            console.error('Chatbot error:', error);
            throw new Error('Không thể kết nối với trợ lý AI. Vui lòng thử lại sau.');
        }
    }

    async callGeminiAPI(message, context) {
        const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: this.formatPrompt(message, context)
                    }]
                }],
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async checkAnswer(question, userAnswer, correctAnswer) {
        const prompt = `
            Câu hỏi: ${question}
            Đáp án đúng: ${correctAnswer}
            Câu trả lời của học sinh: ${userAnswer}
            
            Hãy đánh giá câu trả lời với format sau:
            - Điểm số (0-10):
            - Nhận xét:
            - Gợi ý cải thiện:
        `;

        return this.sendMessage(prompt);
    }

    async getHint(question, currentAnswer = '') {
        const prompt = `
            Câu hỏi: ${question}
            ${currentAnswer ? `Câu trả lời hiện tại: ${currentAnswer}` : ''}
            
            Hãy đưa ra gợi ý giúp học sinh giải bài này, không đưa ra đáp án trực tiếp.
        `;

        return this.sendMessage(prompt);
    }
}

// Initialize chatbot with error handling
try {
    window.chatbot = new ChatBot();
} catch (error) {
    console.error('Failed to initialize chatbot:', error);
}
