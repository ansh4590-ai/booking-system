// ─── BOOKING PAGE ──────────────────────────────────────────────────────────
// This file handles the booking form:
//  1. Block numbers from being typed in the Name field (real-time)
//  2. Block letters from being typed in the Phone field (real-time)
//  3. Auto-fill room type if it was passed in the URL (e.g. from index page)
//  4. Set today as the minimum allowed check-in/check-out date
//  5. Validate the form on submit and send data to the backend API

document.addEventListener('DOMContentLoaded', function() {

    // Get references to the form and input fields
    const bookingForm    = document.getElementById('bookingForm');
    const roomTypeSelect = document.getElementById('roomType');
    const nameInput      = document.getElementById('fullName');
    const phoneInput     = document.getElementById('phone');


    // ── 1. Real-time: Remove any number typed into the Name field ────────────
    nameInput.addEventListener('input', function(e) {
        // Replace anything that is NOT a letter or space with nothing
        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    });


    // ── 2. Real-time: Remove any non-digit typed into the Phone field ────────
    phoneInput.addEventListener('input', function(e) {
        // \D matches any character that is NOT a digit — remove it
        e.target.value = e.target.value.replace(/\D/g, '');

        // Also cap the length at 10 digits
        if (e.target.value.length > 10) {
            e.target.value = e.target.value.slice(0, 10);
        }
    });


    // ── 3. Auto-fill room type from URL query parameter ──────────────────────
    // Example URL: booking.html?type=Deluxe  →  pre-selects "Deluxe" in dropdown
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('type')) {
        roomTypeSelect.value = urlParams.get('type');
    }


    // ── 4. Set today's date as the minimum for both date fields ──────────────
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    document.getElementById('checkInDate').min  = today;
    document.getElementById('checkOutDate').min = today;


    // ── 5. Handle form submission ─────────────────────────────────────────────
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop the default HTML form submit

        // Collect all field values into one object
        const formData = {
            fullName:    document.getElementById('fullName').value.trim(),
            email:       document.getElementById('email').value.trim(),
            phone:       document.getElementById('phone').value.trim(),
            roomType:    document.getElementById('roomType').value,
            guests:      parseInt(document.getElementById('guests').value),
            checkInDate: document.getElementById('checkInDate').value,
            checkOutDate:document.getElementById('checkOutDate').value
        };

        // Validation 1: Name must contain only letters and spaces
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(formData.fullName)) {
            api.showNotification('Name should only contain letters and spaces', 'error');
            return;
        }

        // Validation 2: Phone must be exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            api.showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        // Validation 3: Check-out date must be after check-in date
        if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
            api.showNotification('Check-out date must be after check-in date', 'error');
            return;
        }

        // All validations passed — send data to backend
        try {
            // POST /api/bookings  →  creates a new booking, returns bookingId
            const result = await api.fetch('/bookings', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            api.showNotification('Booking Successful! Your ID: ' + result.bookingId);
            bookingForm.reset();

            // Redirect to the retrieve page after 3 seconds so user can see their booking
            setTimeout(function() {
                window.location.href = 'retrieve.html?id=' + result.bookingId;
            }, 3000);

        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });

});
