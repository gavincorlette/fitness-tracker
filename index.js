const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const { json } = require('stream/consumers');

/* Set up root URL */
app.get("/", (req, res) => {
    res.send("Server is live!");
});

/* Server listening for requests on port 3000 */
app.listen(PORT, () => console.log("App is listening on port " + PORT));

/* Set up JSON storage */
app.use(express.json());

/* Set up post request to receive workout data */
app.post("/workouts", (req, res) => {
    const newWorkout = req.body;
    const filePath = 'workouts.json';
    fs.readFile(filePath, 'utf-8', (err, jsonString) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(jsonString);
        }
    });
});