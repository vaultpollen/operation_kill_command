async function fetchJSON() {
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

    // Creates initial dropdown menu
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
    exerciseListContainer.appendChild(exerciseDiv);

    // Append a button to add more exercises
    addExercise(exercises);
}

// Function to add more exercises dynamically
function addExercise(exercises) {
    // Remove add exercise button
    const existingButton = document.getElementById("add-exercise-btn");
    if (existingButton) {
        existingButton.remove();
    }

    const addButton = document.createElement("button");
    addButton.id = "add-exercise-btn";
    addButton.textContent = "+ Add Exercise";
    addButton.onclick = () => createExerciseDropdown(exercises);

    // Append the button
    document.getElementById("exercise-list").appendChild(addButton);
}

function initializeExerciseLog(exerciseName, category) {
    // Load existing JSON data
    let jsonData = JSON.parse(localStorage.getItem("log")) || {workouts: [] };

    let exercise = jsonData.workouts.find(workout => workout.exercise === exerciseName);

    if (!exercise) {
        // Exercise not found, create a new entry with default values
        const today = new Date();
        const defaultDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];

        const newExercise = {
            exercise: exerciseName,
            category: category,
            lastPerformed: defaultDate,
            log: [
                {
                    date: defaultDate,
                    repts: [0, 0, 0],
                    weight: "BW",
                    newGoal: {
                        sets: [0, 0, 0],
                    }
                }
            ]
        };

        jsonData.workouts.push(newExercise);

        // Save the updated JSON file
        localStorage.setItem("workoutLog", JSON.stringify(jsonData));
    }
}