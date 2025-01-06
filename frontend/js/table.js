const days = ["Pon. 6.01", "Wt. 7.01", "Śr. 8.01", "Czw. 9.01", "Pt. 10.01", "Sob. 11.01", "Nd. 12.01"];
const timeSlots = [
    "8:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00"
];

const calendarHeader = document.getElementById('calendar-header');
const calendarGrid = document.getElementById('calendar-grid');

days.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = day;
    calendarHeader.appendChild(dayDiv);
});

timeSlots.forEach(slot => {
    days.forEach(() => {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');

        const timeSlot = document.createElement('span');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = slot;

        cell.appendChild(timeSlot);
        calendarGrid.appendChild(cell);
    });
});

