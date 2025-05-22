const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');

const workouts = [];

/* Set up root URL */
app.get("/", (req, res) => {
    res.send("Server is live!");
});

/* Server listening for requests on port 3000 */
app.listen(PORT, () => console.log("App is listening on port " + PORT));

/* Set up JSON storage */
app.use(express.json());

/* Set up POST request to receive workout data */
app.post("/workouts", (req, res) => {
    const newWorkout = req.body;
    workouts.push(newWorkout);
    const filePath = 'workouts.json';
    fs.readFile(filePath, 'utf-8', (err, jsonString) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Failed to read file.');
        }
        else {
            console.log(jsonString);
            const jsonObject = JSON.parse(jsonString);
            jsonObject.push(newWorkout);
            const jsonWriteString = JSON.stringify(jsonObject)
            fs.writeFile(filePath, jsonWriteString, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send('Failed to save workout.');
                }
                else {
                    console.log('Workout saved successfully!');
                    res.status(201).send('Workout saved!');
                }
            });
        }
    });
});

/* GET route to retrieve stored workouts */
app.get("/workouts", (req, res) => {
    res.json(workouts);
});