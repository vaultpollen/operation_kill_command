function selectDay(day) {
    const resultDiv = document.getElementById('selected-day');
    resultDiv.textContent = `You've selected: ${day}`;
}

function loadExercises() {
    const workoutType = document.getElementById("workout-type").ariaValueMax;
    const exerciseListContainer = document.getElementById("exercise-list");
    exerciseListContainer.innerHTML = "";

    let exercisesToDisplay = [];

    if (workoutType == "Custom") {
        exercisesToDisplay = [...exerciseMaster.Push, ...exerciseMaster.Pull, ...exerciseMaster.Legs, ...exerciseMaster.Accessories];
    } else {
        exercisesT = exerciseMaster[workoutType];
    }

    createExerciseDropdown(exercisesToDisplay);
}

function createExerciseDropdown(exercises) {
    const exerciseListContainer = document.getElementById("exercise-list");

    exercises.forEach(exercise => {
        const exerciseDiv = document.createElement("div");
        exerciseDiv.classList.add("exercise-container");

        const exerciseDropDown = document.createElement("select");
        exerciseDropDown.classList.add("exercise-dropdown");

        // Create an option for each exercise
        const option = document.createElement("option");
        option.value = exercise.name;
        option.textContent = exercise.name;
        exerciseDropDown.appendChild(option);

        // Append the dropdown
        exerciseDiv.appendChild(exerciseDropdown);

        // Append a + button for more exercises
        const addButton = document.createElement("span");
        addButton.classList.add("add-exercise");
        addButton.textContent = "+";
        addButton.onclick = () => addExercise(exercise.name);
        exerciseDiv.appendChild(addButton);

        exerciseListContainer.appendChild(exerciseDiv);
    });

    // Function to add more exercises dynamically
    function addExercise(currentExercise) {
        const workoutType = document.getElementById("workout-type").value;
        const exercisesToDisplay = workoutType === "Custom" 
            ? [...exerciseMaster.Push, ...exerciseMaster.Pull, ...exerciseMaster.Legs, ...exerciseMaster.Accessories] 
            : exerciseMaster[workoutType];
        
        // Append a new exercise dropdown
        createExerciseDropdown(exercisesToDisplay);
        }
    
        // Initialize by loading exercises for default workout type
        window.onload = loadExercises;
}