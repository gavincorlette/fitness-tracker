const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const pool = require('./database');
const cors = require('cors');

/* Set up CORS to allow requests from the frontend */
app.use(cors());

/*const workouts = [];*/

/* Middleware to parse JSON bodies */
app.use(express.json());

/* Set up root URL */
app.get("/", (req, res) => {
    res.send("Server is live!");
});

/* Tests connection to postgres database */
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

/* Server listening for requests on port 3000 */
app.listen(PORT, () => console.log("App is listening on port " + PORT));

/* Set up POST request to receive workout data */
app.post("/workouts", async(req, res) => {
  /* Workout object*/
    const {
        type,
        duration,
        date,
        time,
        distance,
        measurement,
        intensity,
        notes
    } = req.body;

    /* Query to insert into table */
    const query = `INSERT INTO workouts(type, duration, date, time, distance, measurement, intensity, notes)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `
    
    /* Await version for pool.query() */
    try {
      const workFields = [type, duration, date, time, distance, measurement, intensity, notes];
      await pool.query(query, workFields);
      res.status(201).json({message: "Workout saved!"});
    }
    catch (err) {
      console.error(err);
      res.status(500).json({message: "There was an error."});
    }
});

/* GET route to retrieve stored workouts */
app.get("/workouts", async(req, res) => {
    const result = await pool.query(`SELECT * FROM workouts`);
    res.send(result.rows);
});
