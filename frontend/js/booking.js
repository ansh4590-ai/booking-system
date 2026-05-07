// BOOKING PAGE - Handles room reservations and form validation
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm    = document.getElementById('bookingForm');
    const roomTypeSelect = document.getElementById('roomType');
    const nameInput      = document.getElementById('fullName');
    const phoneInput     = document.getElementById('phone');

    // 1. Input filtering (Real-time)
    nameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    });

    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    // 2. Initialize form with URL parameters and date limits
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('type')) roomTypeSelect.value = urlParams.get('type');

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').min  = today;
    document.getElementById('checkOutDate').min = today;

    // 3. Form Submission and Validation
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName:    document.getElementById('fullName').value.trim(),
            email:       document.getElementById('email').value.trim(),
            phone:       document.getElementById('phone').value.trim(),
            roomType:    document.getElementById('roomType').value,
            guests:      parseInt(document.getElementById('guests').value),
            checkInDate: document.getElementById('checkInDate').value,
            checkOutDate:document.getElementById('checkOutDate').value
        };

        if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
            api.showNotification('Name should only contain letters and spaces', 'error');
            return;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            api.showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
            api.showNotification('Check-out date must be after check-in date', 'error');
            return;
        }

        try {
            const result = await api.fetch('/bookings', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            api.showNotification('Booking Successful! Your ID: ' + result.bookingId);
            bookingForm.reset();

            setTimeout(() => {
                window.location.href = 'retrieve.html?id=' + result.bookingId;
            }, 3000);
        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });
});
