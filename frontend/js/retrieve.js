// RETRIEVE PAGE - Search for existing bookings
document.addEventListener('DOMContentLoaded', function() {
    const searchForm       = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('bookingResults');
    const cardTemplate = document.getElementById('bookingCardTemplate');

    function renderBooking(booking) {
        const card = cardTemplate.content.cloneNode(true);

        card.querySelector('.col-booking-id').textContent = 'Booking ID: ' + booking.bookingId;
        const statusBadge = card.querySelector('.col-status');
        statusBadge.textContent = booking.status;
        statusBadge.classList.add('badge-' + booking.status.toLowerCase());

        card.querySelector('.col-name').textContent  = booking.fullName;
        card.querySelector('.col-email').textContent = booking.email;
        card.querySelector('.col-phone').textContent = booking.phone;

        card.querySelector('.col-room').textContent    = booking.roomType;
        card.querySelector('.col-checkin').textContent = api.formatDate(booking.checkInDate);
        card.querySelector('.col-checkout').textContent= api.formatDate(booking.checkOutDate);
        card.querySelector('.col-guests').textContent  = booking.guests;

        card.querySelector('.col-created').textContent = api.formatDate(booking.createdAt);
        return card;
    }

    // Handle search form submission
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const query = document.getElementById('searchQuery').value.trim();

        try {
            const bookings = await api.fetch('/bookings/search?query=' + encodeURIComponent(query));
            resultsContainer.innerHTML = '';

            if (bookings.length === 0) {
                resultsContainer.innerHTML = '<div class="card text-center"><p>No bookings found.</p></div>';
                return;
            }

            bookings.forEach(b => resultsContainer.appendChild(renderBooking(b)));
        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });

    // Auto-search if ID is in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        document.getElementById('searchQuery').value = urlParams.get('id');
        searchForm.dispatchEvent(new Event('submit'));
    }
});
