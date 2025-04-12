async function populateDropdown() {
    const exerciseMaster = await fetch("exerciseMaster.json");
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