async function fetchEvents(start, end) {
    const response = await fetch(`http://localhost:9090/api/calendar/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return await response.json();
}

// Usage example:
fetchEvents('2023-07-01T00:00:00', '2023-07-31T23:59:59')
    .then(events => console.log(events))
    .catch(error => console.error(error));

async function createEvent(start, end, text) {
    const response = await fetch('http://localhost:9090/api/calendar/events/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            start: start,
            end: end,
            text: text,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create event');
    }
    return await response.json();
}

// Usage example:
createEvent('2023-07-20T10:00:00', '2023-07-20T12:00:00', 'Meeting with team')
    .then(event => console.log(event))
    .catch(error => console.error(error));

async function moveEvent(id, start, end) {
    const response = await fetch('http://localhost:9090/api/calendar/events/move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            start: start,
            end: end,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to move event');
    }
    return await response.json();
}

// Usage example:
moveEvent(1, '2023-07-20T14:00:00', '2023-07-20T16:00:00')
    .then(event => console.log(event))
    .catch(error => console.error(error));

async function setColor(id, color) {
    const response = await fetch('http://localhost:9090/api/calendar/events/setColor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            color: color,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to set event color');
    }
    return await response.json();
}

// Usage example:
setColor(1, '#FF0000')
    .then(event => console.log(event))
    .catch(error => console.error(error));

async function deleteEvent(id) {
    const response = await fetch('http://localhost:9090/api/calendar/events/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete event');
    }
    return await response.json();
}

// Usage example:
deleteEvent(1)
    .then(response => console.log(response.message))
    .catch(error => console.error(error));

document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display events for a specific date range
    fetchEvents('2023-07-01T00:00:00', '2023-07-31T23:59:59')
        .then(events => {
            const currentEventsList = document.querySelector('.current-events ul');
            currentEventsList.innerHTML = ''; // Clear existing events
            events.forEach(event => {
                const listItem = document.createElement('li');
                listItem.textContent = event.text;
                currentEventsList.appendChild(listItem);
            });
        })
        .catch(error => console.error(error));
});