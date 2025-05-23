document.addEventListener("DOMContentLoaded", () => {
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

    form.addEventListener("submit", (e) => {
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

    console.log("Workout logged!");
    });


});