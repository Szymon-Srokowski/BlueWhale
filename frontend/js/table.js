const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

const currentDate = new Date();
let displayedDate = new Date(currentDate);
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const startDay = startDate.getDay() === 0 ? 7 : startDate.getDay();
const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

const calendarGrid = document.getElementById('calendar-grid');
const dateDisplay = document.getElementById('date-display');

days.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-header-cell');
    dayDiv.textContent = day;
    calendarGrid.appendChild(dayDiv);
});

let date = 1;
let nextMonthDate = 1;
let prevMonthStartDate = daysInPrevMonth - (startDay - 2);

for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');

        if (i === 0 && j < startDay - 1) {
            cell.textContent = prevMonthStartDate++;
            cell.classList.add('prev-month');
        } else if (date > daysInMonth) {
            cell.textContent = nextMonthDate++;
            cell.classList.add('next-month');
        } else {
            cell.textContent = date++;
            cell.classList.add('current-month');
        }

        calendarGrid.appendChild(cell);
    }
}

let currentMode = 'month';

function formatDateRange(start, end) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

function setActiveButton(activeButtonId) {
    const buttons = ['day-btn', 'week-btn', 'month-btn'];
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (buttonId === activeButtonId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function updateDateDisplay() {
    if (!dateDisplay) {
        console.error('dateDisplay element not found!');
        return;
    }

    if (currentMode === 'month') {
        const options = { month: 'long', year: 'numeric' };
        dateDisplay.textContent = displayedDate.toLocaleDateString('en-US', options);
    } else if (currentMode === 'week') {
        const startOfWeek = new Date(displayedDate);
        const endOfWeek = new Date(displayedDate);

        startOfWeek.setDate(displayedDate.getDate() - displayedDate.getDay() + 1);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        dateDisplay.textContent = `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}`;
    } else if (currentMode === 'day') {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        dateDisplay.textContent = displayedDate.toLocaleDateString('en-US', options);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    currentMode = 'week';
    setActiveButton('week-btn');
    updateDateDisplay();
});

document.getElementById('day-btn').addEventListener('click', () => {
    currentMode = 'day';
    setActiveButton('day-btn');
    updateDateDisplay();
});

document.getElementById('week-btn').addEventListener('click', () => {
    currentMode = 'week';
    setActiveButton('week-btn');
    updateDateDisplay();
});

document.getElementById('month-btn').addEventListener('click', () => {
    currentMode = 'month';
    setActiveButton('month-btn');
    updateDateDisplay();
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentMode === 'day') {
        displayedDate.setDate(displayedDate.getDate() - 1);
    } else if (currentMode === 'week') {
        displayedDate.setDate(displayedDate.getDate() - 7);
    } else if (currentMode === 'month') {
        displayedDate.setMonth(displayedDate.getMonth() - 1);
    }
    updateDateDisplay();
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentMode === 'day') {
        displayedDate.setDate(displayedDate.getDate() + 1);
    } else if (currentMode === 'week') {
        displayedDate.setDate(displayedDate.getDate() + 7);
    } else if (currentMode === 'month') {
        displayedDate.setMonth(displayedDate.getMonth() + 1);
    }
    updateDateDisplay();
});

document.getElementById('today-btn').addEventListener('click', () => {
    displayedDate = new Date(currentDate);
    updateDateDisplay();
});

const themeToggleButton = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const darkStylesheet = document.getElementById("dark-mode-stylesheet");

themeToggleButton.addEventListener("click", () => {
    const isDarkMode = darkStylesheet.disabled;

    darkStylesheet.disabled = !isDarkMode;

    const newIcon = isDarkMode ? "images/sun.svg" : "images/moon.svg";
    if (themeIcon) {
        themeIcon.setAttribute("src", newIcon);
    }

    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
});

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        darkStylesheet.disabled = false;
        if (themeIcon) themeIcon.setAttribute("src", "images/sun.svg");
    } else {
        darkStylesheet.disabled = true;
        if (themeIcon) themeIcon.setAttribute("src", "images/moon.svg");
    }

    currentMode = "week";
    setActiveButton("week-btn");
    updateDateDisplay();
});
