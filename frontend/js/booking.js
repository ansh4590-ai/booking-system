document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const urlParams = new URLSearchParams(window.location.search);
    const roomTypeSelect = document.getElementById('roomType');
    
    // Real-time Input Filtering (Prevention)
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');

    // Prevent numbers in Name
    nameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    });

    // Prevent alphabets in Phone
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, ''); // \D matches any non-digit
        if (e.target.value.length > 10) {
            e.target.value = e.target.value.slice(0, 10);
        }
    });

    // Auto-fill room type from URL if present
    if (urlParams.has('type')) {
        roomTypeSelect.value = urlParams.get('type');
    }

    // Set min dates for check-in and check-out
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').min = today;
    document.getElementById('checkOutDate').min = today;

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            roomType: document.getElementById('roomType').value,
            guests: parseInt(document.getElementById('guests').value),
            checkInDate: document.getElementById('checkInDate').value,
            checkOutDate: document.getElementById('checkOutDate').value
        };

        // 1. Name Validation (No numbers)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(formData.fullName)) {
            api.showNotification('Name should only contain alphabets and spaces', 'error');
            return;
        }

        // 2. Phone Validation (10 digits only)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            api.showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        // 3. Date Validation
        if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
            api.showNotification('Check-out date must be after check-in date', 'error');
            return;
        }

        try {
            const result = await api.fetch('/bookings', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            api.showNotification(`Booking Successful! Your ID: ${result.bookingId}`);
            bookingForm.reset();
            
            // Optional: Redirect to retrieve page after 2 seconds
            setTimeout(() => {
                window.location.href = `retrieve.html?id=${result.bookingId}`;
            }, 3000);

        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });
});
