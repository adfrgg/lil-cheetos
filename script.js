document.getElementById('reservationForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const idNumber = document.getElementById('idNumber').value;
  const room = document.getElementById('room').value;
  const date = document.getElementById('date').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  reserveTimeSlot(room, date, startTime, endTime, idNumber);
});

function reserveTimeSlot(room, date, startTime, endTime, idNumber) {
  fetch('http://localhost:3000/reserve', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId: idNumber,
          roomId: room,
          startDate: `${date}T${startTime}`,
          endDate: `${date}T${endTime}`
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.reservationId) {
          alert('Reservation successful. Reservation ID: ' + data.reservationId);
      } else {
          alert(data.error || 'Reservation failed');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Failed to make a reservation.');
  });
}
