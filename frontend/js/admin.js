// ADMIN DASHBOARD - Manages all reservations
const bookingsBody = document.getElementById('bookingsBody');
const editModal    = document.getElementById('editModal');
const rowTemplate  = document.getElementById('bookingRowTemplate');

// 1. Load all bookings from the API
async function loadBookings() {
    try {
        const bookings = await api.fetch('/bookings');

        if (bookings.length === 0) {
            bookingsBody.innerHTML = '<tr><td colspan="6" class="text-center">No bookings found.</td></tr>';
            return;
        }

        bookingsBody.innerHTML = '';

        bookings.forEach(function(b) {
            const row = rowTemplate.content.cloneNode(true);
            row.querySelector('.col-id').textContent    = b.bookingId;
            row.querySelector('.col-guest').innerHTML   = b.fullName + '<br><small>' + b.email + '</small>';
            row.querySelector('.col-room').textContent  = b.roomType;
            row.querySelector('.col-dates').innerHTML   = api.formatDate(b.checkInDate) + ' –<br>' + api.formatDate(b.checkOutDate);

            const statusSpan = document.createElement('span');
            statusSpan.className   = 'badge badge-' + b.status.toLowerCase();
            statusSpan.textContent = b.status;
            row.querySelector('.col-status').appendChild(statusSpan);

            row.querySelector('.btn-edit').addEventListener('click', function() {
                openEditModal(b._id, b.status);
            });

            row.querySelector('.btn-delete').addEventListener('click', function() {
                deleteBooking(b._id);
            });

            bookingsBody.appendChild(row);
        });

    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}

// 2. Manage status modal
function openEditModal(bookingId, currentStatus) {
    document.getElementById('editId').value     = bookingId;
    document.getElementById('editStatus').value = currentStatus;
    editModal.style.display = 'flex';
}

function closeModal() {
    editModal.style.display = 'none';
}

async function updateBooking() {
    const id     = document.getElementById('editId').value;
    const status = document.getElementById('editStatus').value;

    try {
        await api.fetch('/bookings/' + id, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        api.showNotification('Booking updated successfully');
        closeModal();
        loadBookings();
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}

// 3. Delete booking
async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
        await api.fetch('/bookings/' + id, { method: 'DELETE' });
        api.showNotification('Booking deleted');
        loadBookings();
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadBookings);
