const bookingsBody = document.getElementById('bookingsBody');
const editModal = document.getElementById('editModal');

async function loadBookings() {
    try {
        const bookings = await api.fetch('/bookings');
        
        if (bookings.length === 0) {
            bookingsBody.innerHTML = '<tr><td colspan="6" class="text-center">No bookings found.</td></tr>';
            return;
        }

        bookingsBody.innerHTML = bookings.map(b => `
            <tr>
                <td><strong>${b.bookingId}</strong></td>
                <td>
                    ${b.fullName}<br>
                    <small style="color: #666;">${b.email}</small>
                </td>
                <td>${b.roomType}</td>
                <td>
                    ${api.formatDate(b.checkInDate)} - <br>
                    ${api.formatDate(b.checkOutDate)}
                </td>
                <td><span class="badge badge-${b.status.toLowerCase()}">${b.status}</span></td>
                <td>
                    <button onclick="openEditModal('${b._id}', '${b.status}')" class="btn" style="padding: 5px 10px; background: #eee; font-size: 0.8rem;">Edit</button>
                    <button onclick="deleteBooking('${b._id}')" class="btn" style="padding: 5px 10px; background: #fee; color: #c00; font-size: 0.8rem; margin-left: 5px;">Del</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}

function openEditModal(id, currentStatus) {
    document.getElementById('editId').value = id;
    document.getElementById('editStatus').value = currentStatus;
    editModal.style.display = 'flex';
}

function closeModal() {
    editModal.style.display = 'none';
}

async function updateBooking() {
    const id = document.getElementById('editId').value;
    const status = document.getElementById('editStatus').value;

    try {
        await api.fetch(`/bookings/${id}`, {
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

async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
        await api.fetch(`/bookings/${id}`, {
            method: 'DELETE'
        });
        api.showNotification('Booking deleted');
        loadBookings();
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadBookings);
