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
                    day.innerHTML = `<time>${prevMonthDayCount++}</time>`;
                } else if (dayCount > daysInMonth) {
                    day.classList.add('empty');
                    day.innerHTML = `<time>${dayCount++ - daysInMonth}</time>`;
                } else {
                    day.setAttribute('data-date', `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${dayCount.toString().padStart(2, '0')}`);
                    day.innerHTML = `<time>${dayCount}</time>`;
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
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        for (let i = 0; i < 7; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            day.setAttribute('data-date', `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`);
            day.innerHTML = `<time>${currentDay.getDate()}</time>`;
            day.addEventListener('click', dateClick);
            calendarBody.appendChild(day);
        }
    }

    function generateCalendarMonths() {
        clearCalendar();
        for (let i = 0; i < 12; i++) {
            const month = document.createElement('div');
            month.classList.add('month-box');
            const monthDate = new Date(currentDate.getFullYear(), i);
            month.setAttribute('data-month', i);
            month.innerHTML = `<time>${monthDate.toLocaleDateString('en-US', { month: 'long' })}</time>`;
            month.addEventListener('click', monthClick);
            calendarBody.appendChild(month);
        }
    }

    function monthClick(event) {
        const month = event.currentTarget.getAttribute('data-month');
        currentDate = new Date(currentDate.getFullYear(), month, 1);
        currentView = 'month';
        updateHeader();
        generateCalendarDays();
    }

    function dateClick(event) {
        const date = event.currentTarget.getAttribute('data-date');
        const title = prompt('Enter event title:');
        if (title) {
            const newEvent = {
                start: date + 'T00:00:00',
                end: date + 'T23:59:59',
                text: title
            };

            fetch(`${apiBaseUrl}/events/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent)
            })
                .then(response => response.json())
                .then(eventData => {
                    const eventElement = document.createElement('div');
                    eventElement.textContent = eventData.text;
                    eventElement.style.backgroundColor = eventData.color;
                    eventElement.classList.add('event');

                    const eventDay = document.querySelector(`.day[data-date="${eventData.start.split('T')[0]}"]`);
                    if (eventDay) {
                        eventDay.appendChild(eventElement);
                    }
                })
                .catch(error => console.error('Error creating event:', error));
        }
    }

    document.getElementById('view-week').addEventListener('click', () => {
        currentView = 'week';
        generateCalendarWeeks();
    });

    document.getElementById('view-month').addEventListener('click', () => {
        currentView = 'month';
        generateCalendarDays();
    });

    document.getElementById('view-year').addEventListener('click', () => {
        currentView = 'year';
        generateCalendarMonths();
    });

    document.getElementById('prev').addEventListener('click', () => {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendarDays();
        } else if (currentView === 'year') {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
            generateCalendarMonths();
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
            generateCalendarWeeks();
        }
        updateHeader();
    });

    document.getElementById('next').addEventListener('click', () => {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendarDays();
        } else if (currentView === 'year') {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            generateCalendarMonths();
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
            generateCalendarWeeks();
        }
        updateHeader();
    });

    updateHeader();
    generateCalendarDays();
});

