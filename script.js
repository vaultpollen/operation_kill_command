async function fetchExerciseData() {
    try {
        const response = await fetch('exerciseMaster.json');
        if (!response.ok) throw new Error('Failed to fetch exercise data');
        return await response.json();
        
    } catch (error) {
        console.error('Error loading exercise data:', error);
        return{};
    }
}

async function loadExercises(workoutType) {
    const exerciseMaster = await fetchExerciseData();
    const exerciseListContainer = document.getElementById("exercise-list");
    exerciseListContainer.innerHTML = "";

    let exercisesToDisplay = [];

    if (workoutType === "Custom") {
        exercisesToDisplay = [...exerciseMaster.Push, ...exerciseMaster.Pull, exerciseMaster.Legs, ...exerciseMaster.Accessories || []];
    } else {
        exercisesToDisplay = exerciseMaster[workoutType] || [];
    }

    createExerciseDropdown(exercisesToDisplay);
}

function createExerciseDropdown(exercises) {
    const exerciseListContainer = document.getElementById("exercise-list");

    // Create a new exercise container
    const exerciseDiv = document.createElement("div");
    exerciseDiv.classList.add("exercise-container");

    // Create a dropdown with all exercises from the category
    const exerciseDropDown = document.createElement("select");
    exerciseDropDown.classList.add("exercise-dropdown");

    // Populate the dropdown with exercise options
    exercises.forEach(exercise => {
        const option = document.createElement("option");
        option.value = exercise.name;
        option.textContent = exercise.name;
        exerciseDropDown.appendChild(option);
    });

    // Append the dropdown
    exerciseDiv.appendChild(exerciseDropDown);

    // Append a button to add more exercises
    const addButton = document.createElement("button");
    addButton.classList.add("add-exercise");
    addButton.textContent = "+ Add Exercise";
    addButton.onclick = () => createExerciseDropdown(exercises);
    exerciseDiv.appendChild(addButton);

    exerciseListContainer.appendChild(exerciseDiv);

    // Function to add more exercises dynamically
    function addExercise(currentExercise, availableExercises) {
        createExerciseDropdown(availableExercises)
    }
}