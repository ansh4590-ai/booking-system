document.addEventListener('DOMContentLoaded', function() {
    const form       = document.getElementById('availabilityForm');
    const resultBox  = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const bookBtn    = document.getElementById('bookBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const roomType = document.getElementById('roomType').value;
        const checkIn  = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;

        if (new Date(checkOut) <= new Date(checkIn)) {
            api.showNotification('Check-out must be after check-in', 'error');
            return;
        }

        try {
            const data = await api.fetch(
                `/availability?roomType=${roomType}&checkIn=${checkIn}&checkOut=${checkOut}`
            );

            resultBox.className = 'availability-result';

            if (data.available) {
                resultBox.classList.add('availability-success');
                resultText.textContent = `Yes! ${roomType} is available for these dates.`;
                
                bookBtn.href = `booking.html?type=${roomType}&in=${checkIn}&out=${checkOut}`;
                bookBtn.classList.add('display-inline-block');
            } else {
                resultBox.classList.add('availability-error');
                resultText.textContent = `Sorry, ${roomType} is fully booked for these dates.`;
                
                bookBtn.classList.remove('display-inline-block');
            }
        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });
});
