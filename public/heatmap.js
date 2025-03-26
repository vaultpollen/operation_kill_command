function getHeatmapColor(lastPerformedDate) {
    const today = new Date();
    const daysSince = Math.floor((today - lastPerformedDate) / (1000 * 60 * 60 * 24));

    // Define color stops (green -> yellow -> red)
    const green = [0, 255, 0];
    const yellow = [255, 255, 0];
    const red = [255, 0, 0];

    let color;
    if (daysSince <= 15) {
        color = interpolateColor(green, yellow, daysSince / 15);
    } else {
        color = interpolateColor(yellow, red, (daysSince - 15) / 15);
    }

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

// Function to interpolate between RGB colors
function interpolateColor(color1, color2, factor) {
    return color1.map((c, i) => Math.round(c + (color2[i] - c) * factor));
}

function generateHeatmap(exercises, logData) {
    const heatmapContainer = document.getElementById("heatmap");

    exercises.forEach(exercise => {
        const exerciseName = exercise.name;
        const logEntry = logData.workouts.find(w => w.exercise === exerciseName);

        // Default to 30 days ago if there is no log entry
        const lastPerformed = logEntry ? new Date(logEntry.lastPerformed) : new Date(new Date().setDate(new Date().getDate() - 30));

        // Calculate heatmap color
        const heatmapColor = getHeatmapColor(lastPerformed);

        // Create div for heatmap item
        const heatmapItem = document.createElement("div");
        heatmapItem.classList.add("heatmap-item");
        heatmapItem.style.backgroundColor = heatmapColor;
        heatmapItem.textContent = exerciseName;

        heatmapContainer.appendChild(heatmapItem);
    });
}