const API_BASE = 'http://localhost:5000/api';

const api = {
    async fetch(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    showNotification(message, type = 'success') {
        const div = document.createElement('div');
        div.className = `notification ${type}`;
        div.textContent = message;
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, 3000);
    },

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
};
