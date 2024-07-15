document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = 'http://localhost:9090/api/calendar';
    const calendarBody = document.querySelector('.calendar-body');
    const month = '2024-07'; // The month for which we are displaying the calendar

    // Function to generate the calendar days
    function generateCalendarDays() {
        const firstDayOfMonth = new Date(month + '-01').getDay();
        const daysInMonth = new Date(2024, 7, 0).getDate();

        let dayCount = 1;
        for (let i = 0; i < 6; i++) {
            const week = document.createElement('div');
            week.classList.add('week');

            for (let j = 0; j < 7; j++) {
                const day = document.createElement('div');
                day.classList.add('day');

                if (i === 0 && j < firstDayOfMonth || dayCount > daysInMonth) {
                    day.setAttribute('data-date', '');
                } else {
                    day.setAttribute('data-date', month + '-' + (dayCount < 10 ? '0' + dayCount : dayCount));
                    day.addEventListener('click', dateClick);
                    dayCount++;
                }

                week.appendChild(day);
            }

            calendarBody.appendChild(week);
        }
    }

    // Function to fetch events and display them
    async function fetchAndDisplayEvents() {
        const start = month + '-01T00:00:00';
        const end = month + '-31T23:59:59';

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

    // Function to handle date clicks
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

    generateCalendarDays();
    fetchAndDisplayEvents();
});
