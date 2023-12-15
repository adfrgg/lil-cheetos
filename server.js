const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./library.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the library database.');
});

// Middlewares

app.use(cors());


app.use(express.json());

// Initialize the database
const initDb = () => {
    db.run(`CREATE TABLE IF NOT EXISTS Rooms (RoomID INTEGER PRIMARY KEY, RoomName TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS Users (UserID INTEGER PRIMARY KEY, UserIdentifier TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS Reservations (ReservationID INTEGER PRIMARY KEY, UserID INTEGER, RoomID INTEGER, StartDate TEXT, EndDate TEXT)`);
};
initDb();

// Reservation endpoint
app.post('/reserve', (req, res) => {
  const { userId, roomId, startDate, endDate } = req.body;

  // SQL to check for overlapping reservations
  const overlapCheckSql = `
        SELECT * FROM Reservations
        WHERE RoomID = ? AND (
            (StartDate < ? AND EndDate > ?) OR
            (StartDate < ? AND EndDate > ?) OR
            (StartDate >= ? AND EndDate <= ?)
        )
    `;

  db.get(overlapCheckSql, [roomId, endDate, startDate], (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (row) {
          res.status(400).json({ error: 'This room is already reserved during the selected time period.' });
          return;
      }

      // Insert the new reservation
      const insertSql = `
          INSERT INTO Reservations (UserID, RoomID, StartDate, EndDate) 
          VALUES (?, ?, ?, ?)
      `;

      db.run(insertSql, [userId, roomId, startDate, endDate], function(err) {
          if (err) {
              res.status(500).json({ error: err.message });
              return;
          }
          res.json({ message: 'Reservation successful', reservationId: this.lastID });
      });
  });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    app.get('/history', (req, res) => {
    const sql = `SELECT * FROM Reservations`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ reservations: rows });
    });
});
app.get('/history', (req, res) => {
  const sql = `SELECT * FROM Reservations`;
  db.all(sql, [], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ reservations: rows });
  });
});

});
