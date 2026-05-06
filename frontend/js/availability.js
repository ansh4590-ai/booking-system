document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('availabilityForm');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const bookBtn = document.getElementById('bookBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const roomType = document.getElementById('roomType').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;

        if (new Date(checkOut) <= new Date(checkIn)) {
            api.showNotification('Check-out must be after check-in', 'error');
            return;
        }

        try {
            const data = await api.fetch(`/availability?roomType=${roomType}&checkIn=${checkIn}&checkOut=${checkOut}`);
            
            resultBox.style.display = 'block';
            if (data.available) {
                resultBox.style.backgroundColor = '#d4edda';
                resultText.style.color = '#155724';
                resultText.textContent = `Yes! ${roomType} is available for these dates.`;
                bookBtn.style.display = 'inline-block';
                bookBtn.href = `booking.html?type=${roomType}&in=${checkIn}&out=${checkOut}`;
            } else {
                resultBox.style.backgroundColor = '#f8d7da';
                resultText.style.color = '#721c24';
                resultText.textContent = `Sorry, ${roomType} is fully booked for these dates.`;
                bookBtn.style.display = 'none';
            }
        } catch (err) {
            api.showNotification(err.message, 'error');
        }
    });
});
