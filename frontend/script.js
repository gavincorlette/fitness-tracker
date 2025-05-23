const form = document.getElementById("workout-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

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