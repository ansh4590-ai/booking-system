// Base URL for all API calls
const API_BASE = 'http://localhost:5000/api';

// api object - contains shared helper functions used across all pages
const api = {

    // Makes an HTTP request to the backend and returns parsed JSON data
    async fetch(endpoint, options = {}) {
        const url = API_BASE + endpoint;

        // Default headers for all requests
        const defaultOptions = {
            headers: { 'Content-Type': 'application/json' }
        };

        try {
            // Merge default options with any extra options passed in
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();

            // If response is not OK (e.g. 400, 404, 500), throw an error
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;

        } catch (error) {
            console.error('API Error:', error);
            throw error; // Re-throw so the calling function can handle it
        }
    },

    // Shows a small pop-up notification at the top-right corner of the screen
    // type can be 'success' (green) or 'error' (red)
    showNotification(message, type = 'success') {
        const div = document.createElement('div');
        div.className = 'notification ' + type;
        div.textContent = message;
        document.body.appendChild(div);

        // Fade out after 3 seconds, then remove from DOM
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, 3000);
    },

    // Converts a date string (e.g. "2026-05-07T...") into a readable local date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
};
