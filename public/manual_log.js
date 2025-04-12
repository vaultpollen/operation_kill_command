async function populateDropdown() {
    const exerciseMaster = await fetch("/api/exerciseMaster");
    response = await exerciseMaster.json();
    const exerciseDropdown = document.getElementById("exercise");
    //const option = document.createElement("option");

    const exercises = [...response.Push, ...response.Pull, ...response.Legs, ...response.Accessories || []];

    exercises.forEach(exercise => {
        const option = document.createElement("option");
        option.value = exercise.name;
        option.textContent = exercise.name;
        exerciseDropdown.appendChild(option);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
})

document.getElementById("exercise").addEventListener("change", updateLogTable);

async function updateLogTable() {
    const selectedExercise = document.getElementById("exercise").value;
    const outputContainer = document.getElementById("log-output");

    try {
        const res = await fetch("/api/log");
        const logs = await res.json();

        const workout = logs.workouts.find(entry => entry.exercise === selectedExercise);

        if (!workout || !workout.log || workout.log.length === 0) {
            outputContainer.innerHTML = "<p>No log data available for this exercise</p>";
            return;
        }

        const logEntry = workout.log[0];
        const { lastPerformed, set, newGoal } = logEntry;

        outputContainer.innerHTML = `
            <table class="log-table">
                <thead>
                    <tr>
                        <th>Last Performed</th>
                        <th colspan="3">Last Working Set</th>
                        <th colspan="3">Next Goal Set</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${lastPerformed}</td>
                        <td>${set[0]}</td>
                        <td>${set[1]}</td>
                        <td>${set[2]}</td>
                        <td>${newGoal.newSet[0]}</td>
                        <td>${newGoal.newSet[1]}</td>
                        <td>${newGoal.newSet[2]}</td>
                    </tr>
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error("Error loading log.json:", error);
        outputContainer.innerHTML = "<p>Error loading log data.</p><br>"
    }
}

// Use later for saving log data
/*
await fetch('/api/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedLog),
});
*/