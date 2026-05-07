// ─── AVAILABILITY PAGE ─────────────────────────────────────────────────────
// This file handles:
//  1. Reading the form inputs (room type, check-in, check-out)
//  2. Validating that check-out is after check-in
//  3. Calling the backend API to check if the room is available
//  4. Showing a green (available) or red (not available) result box

document.addEventListener('DOMContentLoaded', function() {

    // Get references to HTML elements
    const form       = document.getElementById('availabilityForm');
    const resultBox  = document.getElementById('resultBox');   // The result container div
    const resultText = document.getElementById('resultText');  // The message inside the result box
    const bookBtn    = document.getElementById('bookBtn');     // "Proceed to Booking" button


    // Listen for form submit
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default page reload on form submit

        // Read the values the user selected/typed
        const roomType = document.getElementById('roomType').value;
        const checkIn  = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;

        // Validate: check-out must be strictly after check-in
        if (new Date(checkOut) <= new Date(checkIn)) {
            api.showNotification('Check-out must be after check-in', 'error');
            return;
        }

        try {
            // GET /api/availability?roomType=...&checkIn=...&checkOut=...
            // Returns { available: true } or { available: false }
            const data = await api.fetch(
                '/availability?roomType=' + roomType + '&checkIn=' + checkIn + '&checkOut=' + checkOut
            );

            // Show the result box (hidden by default)
            resultBox.style.display = 'block';

            if (data.available) {
                // Room is available — show green message and "Book Now" button
                resultBox.style.backgroundColor = '#d4edda';
                resultText.style.color          = '#155724';
                resultText.textContent          = 'Yes! ' + roomType + ' is available for these dates.';

                // Set the booking link with pre-filled query parameters
                bookBtn.href         = 'booking.html?type=' + roomType + '&in=' + checkIn + '&out=' + checkOut;
                bookBtn.style.display = 'inline-block';

            } else {
                // Room is NOT available — show red message, hide "Book Now" button
                resultBox.style.backgroundColor = '#f8d7da';
                resultText.style.color          = '#721c24';
                resultText.textContent          = 'Sorry, ' + roomType + ' is fully booked for these dates.';
                bookBtn.style.display           = 'none';
            }

        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });

});
