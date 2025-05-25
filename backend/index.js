const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const db = require('./database');

const workouts = [];

/* Set up root URL */
app.get("/", (req, res) => {
    res.send("Server is live!");
});

/* Tests connection to postgres database */
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

/* Server listening for requests on port 3000 */
app.listen(PORT, () => console.log("App is listening on port " + PORT));

/* Set up JSON storage */
app.use(express.json());

/* Set up POST request to receive workout data */
app.post("/workouts", (req, res) => {
    const workout = {
        'workout-type':type,
        duration,
        date,
        time,
        distance,
        measurement,
        intensity,
        notes
    } = req.body;

    const query = `INSERT INTO workouts(type, duration, date, time, distance, measurement, intensity, notes)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `

    pool.query()
});

/* GET route to retrieve stored workouts */
app.get("/workouts", (req, res) => {
    
});
