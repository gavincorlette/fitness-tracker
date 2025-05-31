const form = document.getElementById("workout-form");
/* Set date automatically to current date */
const dateInput = document.getElementById("date");
const todayDate = new Date().toISOString().split("T")[0];
dateInput.value = todayDate;

/* Set time automatically to current time in correct local time*/
const timeInput = document.getElementById("time");
const currTime = new Date();
let hours = currTime.getHours();
let minutes = currTime.getMinutes();
const localTime = `${hours}:${minutes}`;
timeInput.value = localTime;

form.addEventListener("submit", async (e) => {
/* Prevents page from refreshing when submit button is hit */
e.preventDefault();

/* Save all workout fields to variables */
const workoutType = document.getElementById("workout-type").value;
const duration = document.getElementById("duration").value;
/* Validate duration is a positive number */
if (duration <= 0 || isNaN(duration)) {
    alert("Please enter a value greater than 0.");
    return;
}
const date = document.getElementById("date").value;
const time = document.getElementById("time").value;
const distance = document.getElementById("distance").value;
const measurement = document.getElementById("measurement").value;
const intensity = document.querySelector('input[name="intensity"]:checked')?.value;
const notes = document.getElementById("notes").value;
/* Keep number of characters no more than 300 */
if (notes.length > 300) {
    alert("Please limit characters to 300.");
    return;
}

/* Ensures number is not less than or equal to 0, but also allows the field to be left empty */
if (distance !== "" && (Number(distance) <= 0 || isNaN(Number(distance)))) {
    alert("Please input a valid distance.");
    return;
}

/* Ensures that if the distance is filled then a measurement must be chosen */
if (distance !== "" && !measurement) {
    alert("Please choose a unit of measurement.");
    return;
}

// Don't allow distance for certain workout types
if (workoutType === "Weight Lifting" || workoutType === "Yoga") { 
    if (distance !== "") {
        alert("Distance is not applicable for this workout type.");
        return;
    }
}

console.log("Workout logged!");

const workoutData = {
    type: workoutType,
    duration,
    date,
    time: time || null, // Allow time to be null if not provided
    distance: distance || null, // Allow distance to be null if not provided
    measurement: measurement || null, // Allow measurement to be null if not provided
    intensity: intensity || null, // Allow intensity to be null if not provided
    notes: notes || null // Allow notes to be null if not provided
};

fetch("http://localhost:3000/workouts", { // Send a POST request to the server with the workout data
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(workoutData)
})
.then((response) => { // Check if the response is ok (status in the range 200-299)
    if(!response.ok) { // If the response is not ok, throw an error
        throw new Error("Failed to send workout.");
    }
    else { // If the response is ok, parse the JSON
        return response.json();
    }
})
.then((data) => {  // Handle the response data
    alert(data.message); // Show the success message
    form.reset(); // Reset the form fields
    console.log(data.message);  // Log the success message
})
.catch((err) => { // Handle any errors that occurred during the fetch
    alert("Error: " + err.message); // Alert the user about the error
    console.error(err);
});
});