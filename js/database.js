class DatabaseManager {
    static async createUserTable(username) {
        try {
            // Replace with your actual database connection and query
            const tableName = `user_${username.toLowerCase()}_data`;
            const query = `
                CREATE TABLE IF NOT EXISTS ${tableName} (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    content_type VARCHAR(50),
                    title VARCHAR(255),
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;
            
            // Execute query
            const response = await fetch('/api/create-table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tableName,
                    query
                })
            });

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    message: 'User table created successfully'
                };
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            return {
                success: false,
                message: 'Failed to create user table: ' + error.message
            };
        }
    }
}

// Event handler for registration form submission
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('#registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = registrationForm.querySelector('[name="username"]').value;
            const loadingIndicator = registrationForm.querySelector('.loading-indicator');
            const feedbackElement = registrationForm.querySelector('.form-feedback');
            
            try {
                loadingIndicator.classList.add('active');
                
                // Create user table
                const result = await DatabaseManager.createUserTable(username);
                
                if (result.success) {
                    feedbackElement.textContent = result.message;
                    feedbackElement.className = 'form-feedback table-creation-success';
                    // Continue with user registration...
                } else {
                    throw new Error(result.message);
                }
                
            } catch (error) {
                feedbackElement.textContent = error.message;
                feedbackElement.className = 'form-feedback table-creation-error';
            } finally {
                loadingIndicator.classList.remove('active');
            }
        });
    }
});
