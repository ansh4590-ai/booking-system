// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
// This file handles:
//  1. Loading all bookings from the backend and displaying them in a table
//  2. Opening a modal to edit a booking's status
//  3. Saving the updated status back to the backend
//  4. Deleting a booking

// Get references to HTML elements we will use
const bookingsBody = document.getElementById('bookingsBody');
const editModal    = document.getElementById('editModal');


// ── 1. Load all bookings from the API and fill the table ───────────────────
async function loadBookings() {
    try {
        // GET /api/bookings  →  returns an array of all bookings
        const bookings = await api.fetch('/bookings');

        // If no bookings exist, show a simple message in the table
        if (bookings.length === 0) {
            bookingsBody.innerHTML = '<tr><td colspan="6" class="text-center">No bookings found.</td></tr>';
            return;
        }

        // Build one <tr> row for each booking and insert into the table body
        bookingsBody.innerHTML = bookings.map(function(b) {
            return `
                <tr>
                    <td>${b.bookingId}</td>
                    <td>${b.fullName}<br><small>${b.email}</small></td>
                    <td>${b.roomType}</td>
                    <td>${api.formatDate(b.checkInDate)} – ${api.formatDate(b.checkOutDate)}</td>
                    <td><span class="badge badge-${b.status.toLowerCase()}">${b.status}</span></td>
                    <td>
                        <button onclick="openEditModal('${b._id}', '${b.status}')" class="btn btn-outline" style="font-size:0.8rem; padding:4px 10px;">Edit</button>
                        <button onclick="deleteBooking('${b._id}')" class="btn" style="font-size:0.8rem; padding:4px 10px; background:#fee; color:#c00; border:1px solid #fcc; margin-left:5px;">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}


// ── 2. Open the edit modal and pre-fill with the current booking status ─────
function openEditModal(bookingId, currentStatus) {
    document.getElementById('editId').value     = bookingId;
    document.getElementById('editStatus').value = currentStatus;
    editModal.style.display = 'flex'; // Show the modal overlay
}


// ── 3. Close the modal without saving ──────────────────────────────────────
function closeModal() {
    editModal.style.display = 'none';
}


// ── 4. Save the updated status to the backend ──────────────────────────────
async function updateBooking() {
    const id     = document.getElementById('editId').value;
    const status = document.getElementById('editStatus').value;

    try {
        // PUT /api/bookings/:id  →  updates the booking's status field
        await api.fetch('/bookings/' + id, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });

        api.showNotification('Booking updated successfully');
        closeModal();
        loadBookings(); // Refresh the table to show the new status
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}


// ── 5. Delete a booking after confirmation ─────────────────────────────────
async function deleteBooking(id) {
    // Ask the user to confirm before permanently deleting
    const confirmed = confirm('Are you sure you want to delete this booking?');
    if (!confirmed) return;

    try {
        // DELETE /api/bookings/:id  →  removes the booking from the database
        await api.fetch('/bookings/' + id, { method: 'DELETE' });

        api.showNotification('Booking deleted');
        loadBookings(); // Refresh the table
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}


// ── Run loadBookings() when the page finishes loading ──────────────────────
document.addEventListener('DOMContentLoaded', loadBookings);
