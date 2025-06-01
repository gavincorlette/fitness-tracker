const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const pool = require('./database');
const cors = require('cors');
require('dotenv').config();

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

// Strava OAuth2 setup
app.get("/strava/callback", async (req, res) => {
  const code = req.query.code;
  // Check if the code is provided
  if (!code) {
    return res.status(400).send('No code provided'); // Return an error if no code is provided
  }

  try {
    // Exchange the code for an access token
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    // Check if the response is ok
    const data = await response.json();
    if (data.access_token) { // If access token is received
      res.send('Access token received successfully!');
    } else { // If access token is not received, send an error response
      res.status(400).send('Failed to retrieve access token');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});