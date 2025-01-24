const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

const currentDate = new Date();
let displayedDate = new Date(currentDate);
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const startDay = startDate.getDay() === 0 ? 7 : startDate.getDay();
const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

const calendarGrid = document.getElementById('calendar-grid');
const dateDisplay = document.getElementById('date-display');
const hourGrid = document.getElementById('hour-grid')

function generateHeader() {
    calendarGrid.innerHTML = "";
    days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-header-cell');
        dayDiv.textContent = day;
        calendarGrid.appendChild(dayDiv);
    });
}

function generateCalendar() {
    generateHeader();

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
        dateDisplay.textContent = displayedDate.toLocaleDateString('pl-PL', options);
    } else if (currentMode === 'week') {
        const startOfWeek = new Date(displayedDate);
        const endOfWeek = new Date(displayedDate);

        startOfWeek.setDate(displayedDate.getDate() - displayedDate.getDay() + 1);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        dateDisplay.textContent = `${startOfWeek.toLocaleDateString('pl-PL', options)} - ${endOfWeek.toLocaleDateString('pl-PL', options)}`;
    } else if (currentMode === 'day') {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        dateDisplay.textContent = displayedDate.toLocaleDateString('pl-PL', options);
    }
}

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

    if (currentMode === "week") {
        createWeekView();
    } else if (currentMode === "day") {
        updateDayView();
    } else if (currentMode === "month") {
        generateCalendar();
    }
    updateDateDisplay();
});

let currentMode = 'month';

document.getElementById('day-btn').addEventListener('click', () => {
    currentMode = 'day';
    setActiveButton('day-btn');
    switchView('day');
    updateDayView();
    updateDateDisplay();
});

document.getElementById('week-btn').addEventListener('click', () => {
    currentMode = 'week';
    setActiveButton('week-btn');
    switchView('week');
    createWeekView();
    updateDateDisplay();
});

document.getElementById('month-btn').addEventListener('click', () => {
    currentMode = 'month';
    setActiveButton('month-btn');
    switchView('month');
    generateCalendar();
    updateDateDisplay();
});

function changeDate(direction) {
    const increment = direction === 'next' ? 1 : -1;

    if (currentMode === 'day') {
        displayedDate.setDate(displayedDate.getDate() + increment);
        updateDayView();
        updateDateDisplay();
    } else if (currentMode === 'week') {
        displayedDate.setDate(displayedDate.getDate() + increment * 7);
        createWeekView();
        updateDateDisplay();
    } else if (currentMode === 'month') {
        displayedDate.setMonth(displayedDate.getMonth() + increment);
        generateCalendar();
        updateDateDisplay();
    }
}

document.getElementById('prev-btn').addEventListener('click', () => changeDate('prev'));
document.getElementById('next-btn').addEventListener('click', () => changeDate('next'));

document.getElementById('today-btn').addEventListener('click', () => {
    displayedDate = new Date(currentDate);
    switchView(currentMode);
    if (currentMode === 'day') updateDayView();
    else if (currentMode === 'month') generateCalendar();
    updateDateDisplay();
    if (currentMode === 'week') createWeekView();
});

const initHours = () => {

    for (let i = 7; i <= 20; i++) {
        const hour = i.toString().padStart(2, '0');


        const hourLabel = document.createElement('div');
        hourLabel.classList.add('hour-label');
        hourLabel.textContent = hour;

        hourGrid.appendChild(hourLabel);
    }
}
initHours()

function updateDayView() {
    const dayTitle = document.getElementById('day-title');
    const dayGrid = document.getElementById('day-grid');

    const optionsTitle = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const currentDayName = displayedDate.toLocaleDateString('pl-PL', optionsTitle);

    dayTitle.textContent = currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1);

    dayGrid.innerHTML = '';

    for (let i = 7; i <= 20; i++) {
        const row = document.createElement('div');
        row.classList.add('day-grid-row');
        dayGrid.appendChild(row);

    }
}


function switchView(mode) {
    const dayView = document.getElementById('day-view');
    const weekView = document.getElementById('week-view');
    const monthHeader = document.getElementById('calendar-header');
    const monthGrid = document.getElementById('calendar-grid');

    dayView.style.display = 'none';
    weekView.style.display = 'none';
    monthHeader.style.display = 'none';
    monthGrid.style.display = 'none';

    if (mode === 'day') {
        dayView.style.display = 'grid';
        hourGrid.style.display='flex';

    } else if (mode === 'week') {
        weekView.style.display = 'grid';
        hourGrid.style.display='flex';

    } else if (mode === 'month') {
        monthHeader.style.display = 'grid';
        monthGrid.style.display = 'grid';
        hourGrid.style.display='none';
    }
}


function createWeekView() {
    const weekView = document.getElementById('week-view');
    weekView.innerHTML = '';

    const days = ["Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob.", "Niedz."];
    const startOfWeek = new Date(displayedDate);
    const currentDay = displayedDate.getDay();
    const offset = currentDay === 0 ? -6 : 1 - currentDay;
    startOfWeek.setDate(displayedDate.getDate() + offset);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDarkMode = !document.getElementById("dark-mode-stylesheet").disabled;

    const headerBgColor = isDarkMode ? "#0D1421" : "#ffffff";
    const headerTextColor = isDarkMode ? "#ffffff" : "#000000";
    const gridBgColor = isDarkMode ? "#0D1421" : "#f8f8f8";
    const gridBorderColor = isDarkMode ? "#808a9d" : "#808a9d";

    for (let i = 0; i < 8; i++) {
        const cell = document.createElement('div');
        if (i === 0) {
            cell.classList.add('week-grid-cell');
            cell.textContent = '';
        } else {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + i - 1);

            const dayNumber = dayDate.getDate();
            const monthNumber = String(dayDate.getMonth() + 1).padStart(2, '0');

            cell.classList.add('week-header-cell');
            if (dayDate.getTime() === today.getTime()) {
                cell.classList.add('current-day');
            }
            cell.innerHTML = `<strong>${days[i - 1]}</strong><br>${dayNumber}.${monthNumber}`;
        }
        cell.style.backgroundColor = headerBgColor;
        cell.style.color = headerTextColor;
        weekView.appendChild(cell);
    }

    for (let hour = 7; hour <= 20; hour++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');

                const dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + col - 1);

                cell.classList.add('week-grid-cell');
                if (dayDate.getTime() === today.getTime()) {
                    cell.classList.add('current-day');
                }
                cell.style.backgroundColor = gridBgColor;
                cell.style.border = `1px solid ${gridBorderColor}`;
                cell.style.borderBottom = 'none';
                cell.style.borderRight = 'none';

                if (col === 1) {
                    cell.style.borderLeft = 'none';
                }
                if (col === 7) {
                    cell.style.borderRight = 'none';
                }
                if (hour === 20) {
                    cell.style.borderBottom = 'none';
                }

            weekView.appendChild(cell);
        }
    }
}

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

    switchView(currentMode);
    createWeekView();
});

window.onload = () => {
    if (currentMode === 'week') {
        createWeekView();
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        pl: {
            "title": "Plan zajęć",
            "label-album": "Numer albumu",
            "placeholder-album": "Wprowadź numer albumu",
            "label-group": "Grupa",
            "placeholder-group": "Wprowadź grupę",
            "label-teacher": "Wykładowca",
            "placeholder-teacher": "Wprowadź wykładowcę",
            "label-subject": "Przedmiot",
            "placeholder-subject": "Wprowadź nazwę przedmiotu",
            "label-room": "Sala",
            "placeholder-room": "Wprowadź salę",
            "button-show-plan": "Pokaż plan",
            "button-reset-filters": "Wyczyść filtry",
            "button-today": "Dzisiaj",
            "button-day": "Dzień",
            "button-week": "Tydzień",
            "button-month": "Miesiąc",
            "button-prev": "Wstecz",
            "button-next": "Przód",
            "button-export": "Eksport planu",
        },
        en: {
            "title": "Schedule plan",
            "label-album": "Album number",
            "placeholder-album": "Enter album number",
            "label-group": "Group",
            "placeholder-group": "Enter group",
            "label-teacher": "Lecturer",
            "placeholder-teacher": "Enter lecturer",
            "label-subject": "Subject",
            "placeholder-subject": "Enter subject",
            "label-room": "Room",
            "placeholder-room": "Enter room",
            "button-show-plan": "Show plan",
            "button-reset-filters": "Reset filters",
            "button-today": "Today",
            "button-day": "Day",
            "button-week": "Week",
            "button-month": "Month",
            "button-prev": "Back",
            "button-next": "Next",
            "button-export": "Export plan",
        },
    };

    let currentLanguage = 'pl';

    const toggleLanguage = () => {
        currentLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
        document.querySelector('.language-icon').src = currentLanguage === 'pl' ? 'images/pl.svg' : 'images/eng.svg';
        updateTranslations();
    };

    const updateTranslations = () => {
        document.querySelectorAll('[data-translate]').forEach((el) => {
            const key = el.getAttribute('data-translate');

            if (el.tagName === 'BUTTON' && el.querySelector('img')) {
                const span = el.querySelector('span') || document.createElement('span');
                span.textContent = translations[currentLanguage][key];
                if (!el.contains(span)) el.appendChild(span);
            } else if (el.tagName === 'LABEL') {
                const span = el.querySelector('span');
                if (span) span.textContent = translations[currentLanguage][key];
            } else {
                el.textContent = translations[currentLanguage][key];
            }
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach((input) => {
            const key = input.getAttribute('data-translate-placeholder');
            input.placeholder = translations[currentLanguage][key];
        });
    };



    document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

    updateTranslations();
});

document.getElementById('reset-filters-btn').addEventListener('click', () => {
    const inputs = document.querySelectorAll('input[data-translate-placeholder]');
    inputs.forEach(input => {
        input.value = '';
    });
});


