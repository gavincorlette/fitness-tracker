const {Pool} = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

// Fuction to save Strava tokens in the database
async function saveStravaTokens({accessToken, refreshToken, athleteId}) {
  try {
    const query = `INSERT INTO strava_tokens (athlete_id, access_token, refresh_token)
      VALUES ($1, $2, $3)`;
    const values = [athleteId, accessToken, refreshToken];
    
    await pool.query(query, values); // Execute the query to insert tokens into the database
    console.log('Strava tokens saved successfully.');
    return true;
  }
  catch (err) {
    console.error('Error saving Strava tokens:', err);
  }
}

// // Export the pool and saveStravaTokens function for use in other modules
module.exports = {pool, saveStravaTokens};