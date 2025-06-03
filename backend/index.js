const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const {pool, saveStravaTokens} = require('./database');
const cors = require('cors');
require('dotenv').config({path: 'strava.env'}); // Load environment variables from strava.env file

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
  const code = req.query.code; // Get the code from the query parameters
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
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const athleteId = data.athlete.id; // Get the athlete ID from the response
      saveStravaTokens({ accessToken, refreshToken, athleteId }); // Save the tokens in the database

      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);

      res.redirect('http://127.0.0.1:5500/frontend/'); // Redirect to the frontend after successful authentication
    } else { // If access token is not received, send an error response
      console.error('Failed to retrieve access token:', data);
      res.status(400).send('Failed to retrieve access token');
    }
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Internal server error');
  }
});

app.get("/strava/activities", async (req, res) => {
  const athleteId = req.query.athleteId; // Get the athlete ID from the query parameters
  if (!athleteId) {
    return res.status(400).send('No athlete ID provided'); // Return an error if no athlete ID is provided
  }

  try {
    const result = await pool.query('SELECT access_token FROM strava_tokens WHERE athlete_id = $1', [athleteId]);
    if (result.rows.length === 0) {
      return res.status(404).send('No access token found for the given athlete ID'); // Return an error if no access token is found
    }
    const accessToken = result.rows[0].access_token; // Get the access token from the database
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch activities from Strava'); // Throw an error if the response is not ok
    }
    const activities = await response.json(); // Parse the JSON response

    for (const activity of activities) {
      // Insert each activity into the database
      const query = `INSERT INTO strava_activities (strava_id, athlete_id, name, type, distance, moving_time, elapsed_time, start_date, timezone, average_speed, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
      await pool.query(query, [
        activity.id,
        athleteId,
        activity.name,
        activity.type,
        activity.distance,
        activity.moving_time,
        activity.elapsed_time,
        activity.start_date,
        activity.timezone,
        activity.average_speed || null, // Handle average speed if it is not present
        activity.description || null // Handle notes if they are not present
      ]);
    };
  }
  catch (err) {
    console.error('Error retrieving access token:', err);
    return res.status(500).send('Internal server error'); // Return an error if there is an issue with the database query
  }

  res.status(200).json(activities); // Send the activities as a JSON response
  console.log('Activities retrieved successfully');
})