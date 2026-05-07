// ─── RETRIEVE / MY BOOKING PAGE ────────────────────────────────────────────
// This file handles:
//  1. Searching for bookings by ID, email, or phone when the form is submitted
//  2. Cloning the HTML card template (from retrieve.html) for each result
//  3. Auto-searching if a booking ID was passed in the URL (redirect from booking page)

document.addEventListener('DOMContentLoaded', function() {

    // Get references to the form and the results container
    const searchForm       = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('bookingResults');

    // Get the <template> element from retrieve.html
    // It holds the full card layout — JS fills in the data and appends it
    const cardTemplate = document.getElementById('bookingCardTemplate');


    // ── 1. Helper: Clone the card template and fill it with one booking's data ─
    function renderBooking(booking) {

        // Make a fresh copy of the card HTML from the template
        const card = cardTemplate.content.cloneNode(true);

        // Fill in the Booking ID and status badge
        card.querySelector('.col-booking-id').textContent = 'Booking ID: ' + booking.bookingId;

        const statusBadge = card.querySelector('.col-status');
        statusBadge.textContent = booking.status;
        statusBadge.classList.add('badge-' + booking.status.toLowerCase()); // e.g. badge-confirmed

        // Fill in guest details (left column)
        card.querySelector('.col-name').textContent  = booking.fullName;
        card.querySelector('.col-email').textContent = booking.email;
        card.querySelector('.col-phone').textContent = booking.phone;

        // Fill in room/date details (right column)
        card.querySelector('.col-room').textContent    = booking.roomType;
        card.querySelector('.col-checkin').textContent = api.formatDate(booking.checkInDate);
        card.querySelector('.col-checkout').textContent= api.formatDate(booking.checkOutDate);
        card.querySelector('.col-guests').textContent  = booking.guests;

        // Fill in the "Booked on" date at the bottom
        card.querySelector('.col-created').textContent = api.formatDate(booking.createdAt);

        return card;
    }


    // ── 2. Search for bookings when the user submits the form ─────────────────
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop the page from reloading on submit

        const query = document.getElementById('searchQuery').value.trim();

        try {
            // GET /api/bookings/search?query=...
            // Backend searches by bookingId, email, or phone
            const bookings = await api.fetch('/bookings/search?query=' + encodeURIComponent(query));

            // Clear any previous results
            resultsContainer.innerHTML = '';

            // If nothing matches, show a simple message
            if (bookings.length === 0) {
                resultsContainer.innerHTML = '<div class="card text-center"><p>No bookings found with that information.</p></div>';
                return;
            }

            // Render a card for each matching booking and append to results area
            bookings.forEach(function(b) {
                resultsContainer.appendChild(renderBooking(b));
            });

        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });


    // ── 3. Auto-search if a booking ID is in the URL ──────────────────────────
    // This happens when the user is redirected here after completing a booking.
    // Example URL: retrieve.html?id=BK-20260507-XXXX
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        // Pre-fill the search box with the booking ID from the URL
        document.getElementById('searchQuery').value = urlParams.get('id');

        // Trigger the form submit so the search runs automatically
        searchForm.dispatchEvent(new Event('submit'));
    }

});
