document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('bookingResults');

    const renderBooking = (booking) => {
        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <h3>Booking ID: ${booking.bookingId}</h3>
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
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">Booked on: ${api.formatDate(booking.createdAt)}</p>
            </div>
        `;
    };

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('searchQuery').value;

        try {
            const bookings = await api.fetch(`/bookings/search?query=${encodeURIComponent(query)}`);
            
            if (bookings.length === 0) {
                resultsContainer.innerHTML = '<div class="card text-center"><p>No bookings found with that information.</p></div>';
                return;
            }

            resultsContainer.innerHTML = bookings.map(b => renderBooking(b)).join('');
        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });

    // Handle ID from URL if redirected from booking page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        document.getElementById('searchQuery').value = urlParams.get('id');
        searchForm.dispatchEvent(new Event('submit'));
    }
});
