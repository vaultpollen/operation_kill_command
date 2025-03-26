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
    const logData = await fetchLogData();

    const exerciseListContainer = document.getElementById("exercise-list");
    const heatmapContainer = document.getElementById("heatmap");

    // Clear previous containers
    exerciseListContainer.innerHTML = "";
    heatmapContainer.innerHTML = "";

    let exercisesToDisplay = [];

    // Get relevant exercises based on workout type (Custom is just every exercise available)
    if (workoutType === "Custom") {
        exercisesToDisplay = [...exerciseMaster.Push, ...exerciseMaster.Pull, exerciseMaster.Legs, ...exerciseMaster.Accessories || []];
    } else {
        exercisesToDisplay = exerciseMaster[workoutType] || [];
    }

    // Only generate heatmap if there are exercises
    if (exercisesToDisplay.length > 0) {
        generateHeatmap(exercisesToDisplay, logData);
    }

    // Ensure dropdown always regenerates
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

    // Create a button to remove exercises
    const removeButton = document.createElement("button");
    removeButton.textContent = "- Remove Exercise";
    removeButton.classList.add("removeexercise-btn");

    // Event listener to remove dropdown elements
    removeButton.addEventListener("click", () => removeExercise(exerciseDiv, removeButton));

    // Append the dropdown and remove button
    exerciseDiv.appendChild(exerciseDropDown);
    exerciseDiv.appendChild(removeButton);
    exerciseListContainer.appendChild(exerciseDiv);

    // Append a button to add more exercises
    addExercise(exercises);
}

// Function to add more exercises dynamically
function addExercise(exercises) {
    // Remove add exercise button if already present
    const existingButton = document.getElementById("add-exercise-btn");
    if (existingButton) {
        existingButton.remove();
    }

    const exerciseListContainer = document.getElementById("exercise-list");

    // Check if dropdown elements are present
    const exerciseContainers = exerciseListContainer.getElementsByClassName("exercise-container");

    // Remove the button only if no elements are present
    if (exerciseContainers.length > 0) {
        // Create the button
        const addButton = document.createElement("button");
        addButton.id = "add-exercise-btn";
        addButton.textContent = "+ Add Exercise";
        addButton.classList.add("animated-button");
        addButton.onclick = () => createExerciseDropdown(exercises);

        // Append the button
        exerciseListContainer.appendChild(addButton);
    }
}

// Function to remove an exercise (and the remove button)
function removeExercise() {
    const heatmapContainer = document.getElementById("heatmap");

    // Remove exercise dropdown
    const exerciseContainers = document.getElementsByClassName("exercise-container");
    if (exerciseContainers.length > 0) {
        exerciseContainers[exerciseContainers.length - 1].remove();
    }

    // Remove add exercise button if no dropdown elements are present
    if (exerciseContainers.length === 0) {
        const addButton = document.getElementById("add-exercise-btn");
        if (addButton) addButton.remove();

        // Clear heatmap
        heatmapContainer.innerHTML = "";
    }
}

function beginWorkout() {
    const exerciseListContainer = document.getElementById("exercise-list");
    const heatmapContainer = document.getElementById("heatmap")
    const exerciseContainers = document.getElementsByClassName("exercise-container");


    // Clear elements to make space for workout dashboard
    if (exerciseContainers.length > 0) {
        const addButton = document.getElementById("add-exercise-btn");
        //exerciseListContainer.remove();
        if (addButton) addButton.remove();
    } 
    
    // Clear heatmap
    heatmapContainer.innerHTML = "";

    // Create a new container for the workout inputs
    const workoutInputContainer = document.createElement("div");
    workoutInputContainer.id = "workout-input-container";

    // Loop over each exercise container in the exercise list
    Array.from(exerciseContainers).forEach(exerciseDiv => {
        const exerciseName = exerciseDiv.querySelector("select").value;

        // Create a box for the exercise with 3 input fields
        const exerciseBox = document.createElement("div");
        exerciseBox.classList.add("exercise-box");

        // Create 3 input fields
        for (let i = 1; i <=3; i++) {
            const inputField = document.createElement("input");
            inputField.type = "number";
            inputField.placeholder = `Set ${i} for ${exerciseName}`;
            inputField.classList.add("exercise-input");
            exerciseBox.appendChild(inputField);
        }

        // Create the "Commit" button to write the inputs to the log file
        const commitButton = document.createElement("button");
        commitButton.textContent = "Commit";
        commitButton.classList.add("commit-button");

        // Event listener for commit action (define logic later)
        commitButton.addEventListener("click", () => {
            console.log(`Committing data for ${exerciseName}`);
            // Logic here
        });

        exerciseBox.appendChild(commitButton);

        workoutInputContainer.appendChild(exerciseBox);
    });

    document.body.appendChild(workoutInputContainer);
}
