// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
// This file handles:
//  1. Loading all bookings from the backend and filling the table
//  2. Opening a modal to edit a booking's status
//  3. Saving the updated status back to the backend
//  4. Deleting a booking

// Get references to HTML elements we will use
const bookingsBody = document.getElementById('bookingsBody');
const editModal    = document.getElementById('editModal');

// Get the <template> element from admin.html
// This template holds the HTML structure of one table row (no data yet)
const rowTemplate  = document.getElementById('bookingRowTemplate');


// ── 1. Load all bookings from the API and fill the table ───────────────────
async function loadBookings() {
    try {
        // GET /api/bookings  →  returns an array of all booking objects
        const bookings = await api.fetch('/bookings');

        // If no bookings exist, show a simple message
        if (bookings.length === 0) {
            bookingsBody.innerHTML = '<tr><td colspan="6" class="text-center">No bookings found.</td></tr>';
            return;
        }

        // Clear the table body before inserting fresh rows
        bookingsBody.innerHTML = '';

        // Loop through each booking and create a row using the HTML template
        bookings.forEach(function(b) {

            // Clone the <template> content so we get a fresh copy of the row HTML
            const row = rowTemplate.content.cloneNode(true);

            // Fill in each table cell using the class names defined in the template
            row.querySelector('.col-id').textContent    = b.bookingId;

            // Guest cell shows name + email on a new line
            row.querySelector('.col-guest').innerHTML   = b.fullName + '<br><small>' + b.email + '</small>';

            row.querySelector('.col-room').textContent  = b.roomType;

            // Dates cell shows check-in and check-out on separate lines
            row.querySelector('.col-dates').innerHTML   = api.formatDate(b.checkInDate) + ' –<br>' + api.formatDate(b.checkOutDate);

            // Status cell shows a coloured badge (CSS class depends on status value)
            const statusSpan = document.createElement('span');
            statusSpan.className   = 'badge badge-' + b.status.toLowerCase();
            statusSpan.textContent = b.status;
            row.querySelector('.col-status').appendChild(statusSpan);

            // Wire up the Edit button — passes this booking's id and current status
            row.querySelector('.btn-edit').addEventListener('click', function() {
                openEditModal(b._id, b.status);
            });

            // Wire up the Delete button — passes this booking's id
            row.querySelector('.btn-delete').addEventListener('click', function() {
                deleteBooking(b._id);
            });

            // Add the completed row to the table body
            bookingsBody.appendChild(row);
        });

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
        // PUT /api/bookings/:id  →  updates only the status field
        await api.fetch('/bookings/' + id, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });

        api.showNotification('Booking updated successfully');
        closeModal();
        loadBookings(); // Refresh table to show updated status
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}


// ── 5. Delete a booking after asking for confirmation ──────────────────────
async function deleteBooking(id) {
    const confirmed = confirm('Are you sure you want to delete this booking?');
    if (!confirmed) return;

    try {
        // DELETE /api/bookings/:id  →  permanently removes the booking
        await api.fetch('/bookings/' + id, { method: 'DELETE' });

        api.showNotification('Booking deleted');
        loadBookings(); // Refresh table
    } catch (err) {
        api.showNotification(err.message, 'error');
    }
}


// ── Run loadBookings() as soon as the page is ready ────────────────────────
document.addEventListener('DOMContentLoaded', loadBookings);
