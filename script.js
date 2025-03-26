function selectDay(day) {
    const resultDiv = document.getElementById('selected-day');
    resultDiv.textContent = `You've selected: ${day}`;
    alert(`Starting ${day} workout`);
}