// ─── RETRIEVE / MY BOOKING PAGE ────────────────────────────────────────────
// This file handles:
//  1. Building an HTML card to display a single booking's details
//  2. Searching for bookings by ID, email, or phone when the form is submitted
//  3. Auto-searching if a booking ID was passed in the URL (redirect from booking page)

document.addEventListener('DOMContentLoaded', function() {

    // Get references to HTML elements
    const searchForm       = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('bookingResults');


    // ── 1. Helper: Build an HTML card for one booking object ─────────────────
    function renderBooking(booking) {
        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <strong>Booking ID: ${booking.bookingId}</strong>
                    <span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span>
                </div>

                <div class="form-row">
                    <div>
                        <p><strong>Guest Name:</strong> ${booking.fullName}</p>
                        <p><strong>Email:</strong> ${booking.email}</p>
                        <p><strong>Phone:</strong> ${booking.phone}</p>
                    </div>
                    <div>
                        <p><strong>Room Type:</strong> ${booking.roomType}</p>
                        <p><strong>Check-in:</strong> ${api.formatDate(booking.checkInDate)}</p>
                        <p><strong>Check-out:</strong> ${api.formatDate(booking.checkOutDate)}</p>
                        <p><strong>Guests:</strong> ${booking.guests}</p>
                    </div>
                </div>

                <p style="margin-top: 10px; font-size: 0.85rem; color: #666;">
                    Booked on: ${api.formatDate(booking.createdAt)}
                </p>
            </div>
        `;
    }


    // ── 2. Search for bookings when the user submits the form ─────────────────
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent page reload

        const query = document.getElementById('searchQuery').value.trim();

        try {
            // GET /api/bookings/search?query=...
            // Backend searches by bookingId, email, or phone and returns matching array
            const bookings = await api.fetch('/bookings/search?query=' + encodeURIComponent(query));

            // If nothing matches, show a simple message
            if (bookings.length === 0) {
                resultsContainer.innerHTML = '<div class="card text-center"><p>No bookings found with that information.</p></div>';
                return;
            }

            // Render all matching bookings as cards
            resultsContainer.innerHTML = bookings.map(renderBooking).join('');

        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });


    // ── 3. Auto-search if booking ID is in the URL ────────────────────────────
    // This runs when the user is redirected here after completing a booking.
    // Example URL: retrieve.html?id=BK-20260507-XXXX
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        document.getElementById('searchQuery').value = urlParams.get('id');
        // Trigger the form submit so the search runs automatically
        searchForm.dispatchEvent(new Event('submit'));
    }

});
