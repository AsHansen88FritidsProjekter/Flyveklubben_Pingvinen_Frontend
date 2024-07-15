document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = 'http://localhost:9090/api/calendar';
    const calendarBody = document.querySelector('.calendar-body');
    const monthDisplay = document.querySelector('.month');
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let currentView = 'month';
    let currentDate = new Date(2024, 6); // July 2024

    function updateHeader() {
        const options = { year: 'numeric', month: 'long' };
        monthDisplay.textContent = currentDate.toLocaleDateString('en-US', options);
    }

    function clearCalendar() {
        while (calendarBody.firstChild) {
            calendarBody.removeChild(calendarBody.firstChild);
        }
    }

    function generateCalendarDays() {
        clearCalendar();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

        let dayCount = 1;
        let prevMonthDayCount = daysInPrevMonth - firstDayOfMonth + 2;
        for (let i = 0; i < 6; i++) {
            const week = document.createElement('div');
            week.classList.add('week');

            for (let j = 0; j < 7; j++) {
                const day = document.createElement('div');
                day.classList.add('day');

                if (i === 0 && j < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)) {
                    day.classList.add('empty');
                    day.textContent = prevMonthDayCount++;
                } else if (dayCount > daysInMonth) {
                    day.classList.add('empty');
                    day.textContent = dayCount++ - daysInMonth;
                } else {
                    day.setAttribute('data-date', `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${dayCount.toString().padStart(2, '0')}`);
                    day.textContent = dayCount;
                    day.addEventListener('click', dateClick);
                    dayCount++;
                }

                week.appendChild(day);
            }

            calendarBody.appendChild(week);
        }
    }

    function generateCalendarWeeks() {
        clearCalendar();
        const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
        for (let i = 0; i < 7; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            day.setAttribute('data-date', `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`);
            day.textContent = currentDay.getDate();
            day.addEventListener('click', dateClick);
            calendarBody.appendChild(day);
        }
    }

    function generateCalendarYears() {
        clearCalendar();
        for (let i = 0; i < 12; i++) {
            const month = document.createElement('div');
            month.classList.add('day');
            const monthDate = new Date(currentDate.getFullYear(), i);
            month.setAttribute('data-month', i);
            month.textContent = monthDate.toLocaleDateString('en-US', { month: 'long' });
            month.addEventListener('click', monthClick);
            calendarBody.appendChild(month);
        }
    }

    async function fetchAndDisplayEvents() {
        const start = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-01T00:00:00`;
        const end = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}T23:59:59`;

        try {
            const response = await fetch(`${apiBaseUrl}/events?start=${start}&end=${end}`);
            const data = await response.json();
            data.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.textContent = event.text;
                eventElement.style.backgroundColor = event.color;
                eventElement.classList.add('event');

                const eventDay = document.querySelector(`.day[data-date="${event.start.split('T')[0]}"]`);
                if (eventDay) {
                    eventDay.appendChild(eventElement);
                }
            });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function dateClick(event) {
        const date = event.currentTarget.getAttribute('data-date');
        const title = prompt('Enter event title:');
        if (title) {
            const newEvent = {
                start: date + 'T00:00:00',
                end: date + 'T23:59:59',
                text: title
            };

            try {
                const response = await fetch(`${apiBaseUrl}/events/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newEvent)
                });
                const eventData = await response.json();

                const eventElement = document.createElement('div');
                eventElement.textContent = eventData.text;
                eventElement.style.backgroundColor = eventData.color;
                eventElement.classList.add('event');

                const eventDay = document.querySelector(`.day[data-date="${eventData.start.split('T')[0]}"]`);
                if (eventDay) {
                    eventDay.appendChild(eventElement);
                }
            } catch (error) {
                console.error('Error creating event:', error);
            }
        }
    }

    function monthClick(event) {
        const month = event.currentTarget.getAttribute('data-month');
        currentDate = new Date(currentDate.getFullYear(), month, 1);
        currentView = 'month';
        updateHeader();
        generateCalendarDays();
        fetchAndDisplayEvents();
    }

    document.getElementById('view-week').addEventListener('click', () => {
        currentView = 'week';
        generateCalendarWeeks();
    });

    document.getElementById('view-month').addEventListener('click', () => {
        currentView = 'month';
        generateCalendarDays();
        fetchAndDisplayEvents();
    });

    document.getElementById('view-year').addEventListener('click', () => {
        currentView = 'year';
        generateCalendarYears();
    });

    document.getElementById('prev').addEventListener('click', () => {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendarDays();
        } else if (currentView === 'year') {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
            generateCalendarYears();
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
            generateCalendarWeeks();
        }
        updateHeader();
        fetchAndDisplayEvents();
    });

    document.getElementById('next').addEventListener('click', () => {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendarDays();
        } else if (currentView === 'year') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            generateCalendarYears();
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
            generateCalendarWeeks();
        }
        updateHeader();
        fetchAndDisplayEvents();
    });

    updateHeader();
    generateCalendarDays();
    fetchAndDisplayEvents();
});