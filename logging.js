
// Initialize the exercise log by either loading exercise log data or initializing exercises that have not been populated yet
// Should only need to be done once, planning on adding a function to push new exercises to the master manually
async function fetchLogData() {
    try {
        const response = await fetch('log.json');
        if (!response.ok) throw new Error('Failed to fetch log data');

        const text = await response.text();
        console.log('Log data received:', text);

        const data = JSON.parse(text);
        if (!data.workouts) {
            console.warn('Log data is empty or malformed. Initializing with default structure.');
            return { workouts: [] };
        }

        return await data;
    } catch (error) {
        console.error('Error loading log data:', error);
        return { workouts: [] };
    }
}

async function saveLogData(updatedLogData) {
    try {
        const response = await fetch('log.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLogData),
        });

        if (!response.ok) {
            throw new Error('Failed to save log data');
        }

        console.log('Log data saved successfully.');
    } catch (error) {
        console.error('Error saving log data:', error);
    }
}

async function initializeExerciseLog(category) {
    // Load existing JSON data
    let jsonData = await fetchLogData();

    const exerciseMaster = await fetchExerciseData();

    console.log(exerciseMaster);

    // Check if the category exists in exerciseMaster
    if (!exerciseMaster[category]) {
        console.warn(`Category ${category} not found in exercise master.`);
        return;
    }

    // Get the list of exercises for the selected category
    const exercises = exerciseMaster[category];

    // Iterate through all exercises in the master list
    exercises.forEach((exerciseInfo) => {
        const { name: exerciseName, category } = exerciseInfo;

        // Check if the exercise already exists in the log
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
                        reps: [0, 0, 0],
                        weight: "BW",
                        newGoal: {
                            sets: [0, 0, 0],
                        }
                    }
                ]
            };

            jsonData.workouts.push(newExercise);
        }
    });

    // Save the updated JSON file
    await saveLogData(jsonData);
}