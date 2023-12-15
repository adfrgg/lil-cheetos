document.addEventListener('DOMContentLoaded', function() {
  fetchReservations();
});

function fetchReservations() {
  fetch('http://localhost:3000/history')
      .then(response => response.json())
      .then(data => {
          console.log(data)
          displayReservations(data.reservations);
      })
      .catch(error => {
          console.error('Error fetching history:', error);
      });
}

function displayReservations(reservations) {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';

  reservations.forEach(reservation => {
      const reservationDiv = document.createElement('div');
      reservationDiv.className = 'reservation';
      reservationDiv.innerHTML = `
          <p>Reservation ID: ${reservation.ReservationID}</p>
          <p>User ID: ${reservation.UserID}</p>
          <p>Room ID: ${reservation.RoomID}</p>
          <p>Start: ${reservation.StartDate}</p>
          <p>End: ${reservation.EndDate}</p>
      `;
      historyList.appendChild(reservationDiv);
  });
  
}
