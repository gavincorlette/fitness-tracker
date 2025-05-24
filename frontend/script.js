document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("workout-form");
    /* Set date automatically to current date */
    const dateInput = document.getElementById("date");
    const todayDate = new Date().toISOString().split("T")[0];
    dateInput.value = todayDate;

    form.addEventListener("submit", (e) => {
    /* Prevents page from refreshing when submit button is hit */
    e.preventDefault();

    /* Save all workout fields to variables */
    const workoutType = document.getElementById("workout-type").value;
    const duration = document.getElementById("duration").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const distance = document.getElementById("distance").value;
    const measurement = document.getElementById("measurement").value;
    const intensity = document.querySelector('input[name="intensity"]:checked')?.value;
    const notes = document.getElementById("notes").value;

    console.log("Workout logged!");
    });


});