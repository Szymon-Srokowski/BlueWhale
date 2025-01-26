const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
const currentDate = new Date();
let displayedDate = new Date(currentDate);
const calendarGrid = document.getElementById('calendar-grid');
const dateDisplay = document.getElementById('date-display');
const hourGrid = document.getElementById('hour-grid');
const albumInput = document.getElementById('album-input');
let currentMode = 'month';

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
    const startDate = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1);
    const startDay = startDate.getDay() === 0 ? 7 : startDate.getDay();
    const daysInMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();
    const daysInPrevMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 0).getDate();
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
    fetchScheduleData();
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
        const options = {month: 'long', year: 'numeric'};
        dateDisplay.textContent = displayedDate.toLocaleDateString('pl-PL', options);
    } else if (currentMode === 'week') {
        const startOfWeek = new Date(displayedDate);
        const currentDay = displayedDate.getDay();
        const offset = currentDay === 0 ? -6 : 1 - currentDay;
        startOfWeek.setDate(displayedDate.getDate() + offset);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const options = {day: 'numeric', month: 'short', year: 'numeric'};
        dateDisplay.textContent = `${startOfWeek.toLocaleDateString('pl-PL', options)} - ${endOfWeek.toLocaleDateString('pl-PL', options)}`;
    } else if (currentMode === 'day') {
        const options = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
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
        renderWeekSchedule(currentEv);
    } else if (currentMode === "day") {
        updateDayView();
        renderDaySchedule(currentEv);
    } else if (currentMode === "month") {
        generateCalendar();
        renderMonthSchedule(currentEv);
    }
    updateDateDisplay();
});


document.getElementById('day-btn').addEventListener('click', () => {
    currentMode = 'day';
    setActiveButton('day-btn');
    switchView('day');
    updateDayView();
    updateDateDisplay();
    fetchScheduleData();
});

document.getElementById('week-btn').addEventListener('click', () => {
    currentMode = 'week';
    setActiveButton('week-btn');
    switchView('week');
    createWeekView();
    updateDateDisplay();
    fetchScheduleData();
});

document.getElementById('month-btn').addEventListener('click', () => {
    currentMode = 'month';
    setActiveButton('month-btn');
    switchView('month');
    generateCalendar();
    updateDateDisplay();
    fetchScheduleData();
});

function changeDate(direction) {
    const increment = direction === 'next' ? 1 : -1;

    if (currentMode === 'day') {
        displayedDate.setDate(displayedDate.getDate() + increment);
        updateDayView();
    } else if (currentMode === 'week') {
        displayedDate.setDate(displayedDate.getDate() + increment * 7);
        createWeekView();
    } else if (currentMode === 'month') {
        displayedDate.setMonth(displayedDate.getMonth() + increment);
        generateCalendar();
    }
    updateDateDisplay();
    fetchScheduleData();
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
    fetchScheduleData();
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

    const optionsTitle = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
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
        hourGrid.style.display = 'flex';

    } else if (mode === 'week') {
        weekView.style.display = 'grid';
        hourGrid.style.display = 'flex';

    } else if (mode === 'month') {
        monthHeader.style.display = 'grid';
        monthGrid.style.display = 'grid';
        hourGrid.style.display = 'none';
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
    fetchScheduleData();
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
let isScheduleCleared = false;

document.getElementById('reset-filters-btn').addEventListener('click', () => {
    const inputs = document.querySelectorAll('input[data-translate-placeholder]');
    inputs.forEach(input => {
        input.value = '';
    });
    clearTable();
    currentEv = [];
    isScheduleCleared = true;
});

let currentEv = [];
function fetchScheduleData() {
    const studentIndex = albumInput.value.trim();

    if (!studentIndex) {
        console.error('Numer albumu is empty. Cannot fetch data.');
        clearTable();
        return;
    }

    let startDate, endDate;

    if (currentMode === 'day') {
        startDate = displayedDate.toISOString().split('T')[0];
        endDate = displayedDate.toISOString().split('T')[0];
    } else if (currentMode === 'week') {
        const startOfWeek = new Date(displayedDate);
        const endOfWeek = new Date(displayedDate);

        const currentDay = displayedDate.getDay();
        const offsetToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        const offsetToSunday = currentDay === 0 ? 0 : 7 - currentDay;

        startOfWeek.setDate(displayedDate.getDate() + offsetToMonday);
        endOfWeek.setDate(displayedDate.getDate() + offsetToSunday);

        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = endOfWeek.toISOString().split('T')[0];
    } else if (currentMode === 'month') {
        const firstDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1);
        const lastDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0);
        startDate = firstDayOfMonth.toISOString().split('T')[0];
        endDate = lastDayOfMonth.toISOString().split('T')[0];
    }

    const apiUrl = `http://localhost:8000/fetch-student-schedule-range?index=${studentIndex}&startDate=${startDate}&endDate=${endDate}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed: HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                if (data.data && data.data.length > 0) {
                    currentEv = data.data;
                    renderSchedule(currentEv);
                } else {
                    currentEv = [];
                    clearTable();
                    console.log('No data for the given index. Showing empty table.');
                }
            } else {
                console.error(data.message);
                clearTable();
            }
        })
        .catch(error => {
            console.error('Error fetching schedule:', error);
            clearTable();
        });
}

function renderSchedule(events) {
    clearTable();
    if (currentMode === 'day') {
        renderDaySchedule(events);
    } else if (currentMode === 'week') {
        renderWeekSchedule(events);
    } else if (currentMode === 'month') {
        renderMonthSchedule(events);
    }
}

function renderDaySchedule(events) {
    const dayView = document.getElementById('day-grid');
    dayView.innerHTML = '';

    for (let i = 7; i <= 20; i++) {
        const row = document.createElement('div');
        row.classList.add('day-grid-row');
        row.textContent = '';
        dayView.appendChild(row);
    }

    const startOfDay = new Date(displayedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const filteredEvents = events.filter(event => {
        const eventStartTime = new Date(event.start_time);
        const eventEndTime = new Date(event.end_time);
        return (
            (eventStartTime >= startOfDay && eventStartTime <= endOfDay) ||
            (eventEndTime >= startOfDay && eventEndTime <= endOfDay) ||
            (eventStartTime <= startOfDay && eventEndTime >= endOfDay)
        );
    });

    filteredEvents.forEach(event => {
        const startTime = new Date(event.start_time);
        const endTime = new Date(event.end_time);

        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.textContent = `${event.title} (${event.room})`;

        const startRow = Math.max(startTime.getHours() - 7, 0) + 1;
        const spanRows = Math.max(endTime.getHours() - startTime.getHours(), 1);

        eventDiv.classList.add('event');
        eventDiv.textContent = `${event.title} (${event.room})`;
        eventDiv.style.gridRow = `${startTime.getHours() - 7 + 1} / span ${endTime.getHours() - startTime.getHours()} `;
        eventDiv.style.padding = "0"
        eventDiv.style.marginTop = "5px"
        const rowHeight = (endTime.getHours() - startTime.getHours()) * 32.86 / 1.75 + 20;
        eventDiv.style.height = `${rowHeight}px`;
        eventDiv.style.width = "100%"
        eventDiv.style.backgroundColor = event.color;
        eventDiv.style.borderColor = event.borderColor;
        dayView.appendChild(eventDiv);
    });
}

function renderWeekSchedule(events) {
    const weekView = document.getElementById('week-view');
    if (!weekView.querySelector('.week-grid-cell')) {
        createWeekView();
    }
    const startOfWeek = new Date(displayedDate);
    const currentDay = displayedDate.getDay();
    const offset = currentDay === 0 ? -6 : 1 - currentDay;
    startOfWeek.setDate(displayedDate.getDate() + offset);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    weekView.querySelectorAll('.event').forEach(event => event.remove());

    const filteredEvents = events.filter(event => {
        const eventStartTime = new Date(event.start_time);
        return eventStartTime >= startOfWeek && eventStartTime <= endOfWeek;
    });

    filteredEvents.forEach(event => {
        const startTime = new Date(event.start_time);
        const endTime = new Date(event.end_time);

        const column = (startTime.getDay() + 6) % 7;
        const rowStart = (startTime.getHours() - 7) * 32.86 + 48;
        const rowHeight = (endTime.getHours() - startTime.getHours()) * 32.86 / 1.75 + 10;

        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.textContent = `${event.title} (${event.room}) \n `;
        eventDiv.textContent += `\n ${event.worker_title}`;
        eventDiv.style.top = `${rowStart}px`;
        eventDiv.style.height = `${rowHeight}px`;
        eventDiv.style.left = `${column * 14.285}%`;
        eventDiv.style.width = `14.285%`;

        eventDiv.style.backgroundColor = event.color;
        eventDiv.style.borderColor = event.borderColor;

        weekView.appendChild(eventDiv);
    });
    console.log(events)
}

function createPopover(target, event) {
    const popover = document.createElement('div');
    popover.innerHTML = `
        <div><strong>${event.title}</strong></div>
        <div>Sala: ${event.room}</div>
        <div>Wykładowca: ${event.worker_title}</div>
        <div>Grupa: ${event.group_name}</div>
        <div>Początek: ${new Date(event.start_time).toLocaleString('pl-PL')}</div>
        <div>Koniec: ${new Date(event.end_time).toLocaleString('pl-PL')}</div>
    `;
    popover.style.position = "absolute";
    popover.style.padding = "10px";
    popover.style.backgroundColor = "#FFCC00";
    popover.style.color = "black";
    popover.style.borderRadius = "5px";
    popover.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
    popover.style.whiteSpace = "normal";
    popover.style.zIndex = "1000";
    popover.style.width = "250px";
    popover.style.fontSize = "14px";
    popover.style.fontWeight = "bold";
    popover.style.textAlign = "left";

    document.body.appendChild(popover);
    const rect = target.getBoundingClientRect();
    popover.style.top = `${rect.top - popover.offsetHeight - 10}px`;
    popover.style.left = `${rect.left + rect.width / 2 - popover.offsetWidth / 2}px`;

    return popover;
}

function renderMonthSchedule(events) {
    const monthView = document.getElementById('calendar-grid');
    monthView.querySelectorAll('.event-month').forEach(event => event.remove());
    monthView.querySelectorAll('.event-day').forEach(cell => cell.classList.remove('event-day'));

    const firstDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1);
    const lastDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0);

    const startOffset = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    const dayCells = Array.from(monthView.querySelectorAll('.calendar-cell')).filter((cell, index) => {
        const isCurrentMonth = !cell.classList.contains('prev-month') && !cell.classList.contains('next-month');
        return isCurrentMonth && index >= startOffset;
    });

    events.forEach(event => {
        const eventStartTime = new Date(event.start_time);
        if (eventStartTime < firstDayOfMonth || eventStartTime > lastDayOfMonth) {
            return;
        }
        const dayIndex = eventStartTime.getDate() - 1;
        const dayCell = dayCells[dayIndex];

        if (dayCell) {
            dayCell.classList.add('event-day');
            const eventDiv = document.createElement('div');

            eventDiv.textContent = `${event.title} (${event.room})`;
            eventDiv.style.backgroundColor = event.color;
            eventDiv.style.borderColor = event.borderColor;
            eventDiv.style.position = 'relative';
            eventDiv.classList.add('event-month');
            eventDiv.addEventListener('mouseover', () => {
                eventDiv._popover = createPopover(eventDiv, event);
            });

            eventDiv.addEventListener('mouseout', () => {
                if (eventDiv._popover) {
                    eventDiv._popover.remove();
                    eventDiv._popover = null;
                }
            });

            dayCell.appendChild(eventDiv);
        }
    });
}

function clearTable() {
    const weekView = document.getElementById('week-view');
    const dayView = document.getElementById('day-grid');
    const monthView = document.getElementById('calendar-grid');

    weekView.querySelectorAll('.event').forEach(event => event.remove());
    dayView.querySelectorAll('.event').forEach(event => event.remove());
    monthView.querySelectorAll('.calendar-cell').forEach(cell => {
        cell.classList.remove('event-day');
        cell.querySelectorAll('.event-month').forEach(event => event.remove());
        cell.innerHTML = cell.innerHTML.split('<br>')[0];
    });
    console.log('Table cleared, preserving structure.');
}

document.getElementById('pokaz-plan-btn').addEventListener('click', () => {
    fetchScheduleData();
});

document.getElementById('export-btn').addEventListener('click', () => {
    const studentIndex = albumInput.value.trim();
    if (!studentIndex) {
        alert('Введите номер студента!');
        return;
    }
    fetch(`http://localhost:8000/fetch-student-schedule?index=${studentIndex}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error API: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success' && data.data && data.data.length > 0) {
                exportToPDF(data.data, studentIndex);
            } else {
                alert('Student data not found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Export error.');
        });
});


function exportToPDF(events, studentIndex) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const titleText = replacePolishChars(`Rozkład dla studenta: ${studentIndex}`);
    doc.setFont("Times", "normal");
    doc.setFontSize(16);
    doc.text(titleText, 10, 10);

    let currentY = 20;

    const eventsByDate = events.reduce((acc, event) => {
        const date = new Date(event.start_time).toLocaleDateString('pl-PL');
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});

    for (const [date, eventsOnDate] of Object.entries(eventsByDate)) {
        if (currentY > 280) {
            doc.addPage();
            currentY = 20;
        }
        doc.setFontSize(14);
        doc.text(replacePolishChars(`Data: ${date}`), 10, currentY);
        currentY += 10;
        eventsOnDate.forEach(event => {
            if (currentY > 280) {
                doc.addPage();
                currentY = 20;
            }

            const eventDetails = [
                `${event.title} (${event.room})`,
                `Wykładowca: ${event.worker_title || "Brak danych"}`,
                `Grupa: ${event.group_name || "Brak danych"}`,
                `Czas: ${new Date(event.start_time).toLocaleTimeString('pl-PL')} - ${new Date(event.end_time)
                    .toLocaleTimeString('pl-PL')}`
            ];

            eventDetails.forEach(detail => {
                const lines = doc.splitTextToSize(replacePolishChars(detail), 180);
                doc.text(lines, 10, currentY);
                currentY += lines.length * 6;
            });

            currentY += 6;
        });

        currentY += 10;
    }

    doc.save(`Schedule_${studentIndex}.pdf`);
}

function replacePolishChars(str) {
    const charMap = {
        'ą': 'ą', 'ć': 'ć', 'ę': 'ę', 'ł': 'ł', 'ń': 'ń',
        'ó': 'ó', 'ś': 'ś', 'ź': 'ź', 'ż': 'ż',
        'Ą': 'Ą', 'Ć': 'Ć', 'Ę': 'Ę', 'Ł': 'Ł', 'Ń': 'Ń',
        'Ó': 'Ó', 'Ś': 'Ś', 'Ź': 'Ź', 'Ż': 'Ż'
    };
    return str.replace(/[^\w\s]/g, char => charMap[char] || char);
}