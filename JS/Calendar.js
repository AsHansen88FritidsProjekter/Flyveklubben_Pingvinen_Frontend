document.addEventListener("DOMContentLoaded", function() {
    let currentYear = new Date().getFullYear();
    const yearElement = document.querySelector(".year");
    yearElement.textContent = currentYear;

    // Create buttons for create, edit, and delete functionalities
    const createEventButton = document.querySelector(".create-event");
    const editEventButton = document.createElement("button");
    const deleteEventButton = document.createElement("button");
    const seeEventsButton = document.querySelector(".see-events");
    const eventsBox = document.querySelector(".events-box");

    editEventButton.textContent = "Edit Event";
    deleteEventButton.textContent = "Delete Event";

    // Append buttons to the calendar-left div
    const calendarLeft = document.querySelector(".calendar-left");
    calendarLeft.appendChild(editEventButton);
    calendarLeft.appendChild(deleteEventButton);

    // Event listeners for the buttons
    createEventButton.addEventListener("click", function() {
        const selectedDateElement = document.querySelector(".selected-date");
        if (selectedDateElement) {
            const selectedDate = selectedDateElement.textContent.trim();
            const eventText = prompt("Enter event details:");
            if (eventText) {
                createEvent(selectedDate, eventText);
            }
        } else {
            alert("Please select a date first.");
        }
    });

    editEventButton.addEventListener("click", function() {
        alert("Edit event button clicked");
        // Add your edit event logic here
        editEvent();
    });

    deleteEventButton.addEventListener("click", function() {
        alert("Delete event button clicked");
        // Add your delete event logic here
        deleteEvent();
    });

    seeEventsButton.addEventListener("click", function() {
        const selectedMonthIndex = getSelectedMonthIndex();
        const start = new Date(currentYear, selectedMonthIndex, 1);
        const end = new Date(currentYear, selectedMonthIndex + 1, 0);
        fetchEvents(start, end)
            .then(events => {
                displayEvents(events);
            });
    });

    // Add event listeners to each month
    const monthElements = document.querySelectorAll(".month-hover");
    monthElements.forEach(function(monthElement) {
        monthElement.addEventListener("click", function() {
            // Remove previous selected month class
            document.querySelectorAll(".selected-month").forEach(function(el) {
                el.classList.remove("selected-month");
            });
            // Add selected class to clicked month
            monthElement.classList.add("selected-month");

            // Update the calendar with the selected month
            updateCalendarWithMonth(monthElement.textContent.trim());
        });
    });

    // Add event listeners to the year arrows
    const prevYearArrow = document.querySelector(".triangle-left");
    const nextYearArrow = document.querySelector(".triangle-right");

    prevYearArrow.addEventListener("click", function() {
        currentYear--;
        yearElement.textContent = currentYear;
        updateCalendarWithMonth(getSelectedMonth());
    });

    nextYearArrow.addEventListener("click", function() {
        currentYear++;
        yearElement.textContent = currentYear;
        updateCalendarWithMonth(getSelectedMonth());
    });

    // Add event listeners to each date
    function addDateEventListeners() {
        const dateElements = document.querySelectorAll(".date-hover");
        dateElements.forEach(function(dateElement) {
            dateElement.addEventListener("click", function() {
                // Remove previous selected date class
                document.querySelectorAll(".selected-date").forEach(function(el) {
                    el.classList.remove("selected-date");
                });
                // Add selected class to clicked date
                dateElement.classList.add("selected-date");

                // Get the clicked date
                const clickedDate = dateElement.textContent.trim();
                if (clickedDate) {
                    updateLeftContainerWithDate(clickedDate);
                }
            });
        });
    }

    // Function to update the left container with the clicked date
    function updateLeftContainerWithDate(date) {
        const numDateElement = document.querySelector(".num-date");
        const dayElement = document.querySelector(".day");

        const selectedMonthIndex = getSelectedMonthIndex();
        const dateObject = new Date(currentYear, selectedMonthIndex, date);
        const dayName = dateObject.toLocaleDateString("da-DK", { weekday: 'long' }).toUpperCase();

        numDateElement.textContent = date;
        dayElement.textContent = dayName;
    }

    // Function to update the calendar with the selected month
    function updateCalendarWithMonth(month) {
        const selectedMonthIndex = getSelectedMonthIndex();
        const firstDay = new Date(currentYear, selectedMonthIndex, 1).getDay();
        const daysInMonth = new Date(currentYear, selectedMonthIndex + 1, 0).getDate();

        const numDatesContainer = document.querySelector(".num-dates");
        numDatesContainer.innerHTML = "";

        // Fill the calendar with dates
        let dateHTML = "";
        for (let i = 0; i < firstDay; i++) {
            dateHTML += '<span class="date-empty"></span>';
        }
        for (let day = 1; day <= daysInMonth; day++) {
            dateHTML += `<span class="date-hover">${day}</span>`;
        }
        numDatesContainer.innerHTML = dateHTML;

        // Add event listeners to the new date elements
        addDateEventListeners();

        // Show the current date in the left container if it's the current month
        const today = new Date();
        if (today.getFullYear() === currentYear && today.getMonth() === selectedMonthIndex) {
            const currentDate = today.getDate();
            highlightDate(currentDate);
            updateLeftContainerWithDate(currentDate);
        } else {
            // Clear the date if the current month is not selected
            document.querySelector(".num-date").textContent = "";
            document.querySelector(".day").textContent = "";
        }

        // Fetch and display events for the selected month
        fetchEventsForMonth(currentYear, selectedMonthIndex);
    }

    // Function to highlight the current date
    function highlightDate(date) {
        // Remove previous selected date class
        document.querySelectorAll(".selected-date").forEach(function(el) {
            el.classList.remove("selected-date");
        });
        // Find the date element and add selected class
        document.querySelectorAll(".date-hover").forEach(function(el) {
            if (el.textContent.trim() === String(date)) {
                el.classList.add("selected-date");
            }
        });
    }

    // Helper function to get the selected month index
    function getSelectedMonthIndex() {
        const selectedMonth = getSelectedMonth();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(selectedMonth);
    }

    // Helper function to get the selected month
    function getSelectedMonth() {
        return document.querySelector(".selected-month").textContent.trim();
    }

    // Initialize the calendar with the current month
    const currentMonthIndex = new Date().getMonth();
    document.querySelectorAll(".month-hover")[currentMonthIndex].classList.add("selected-month");
    updateCalendarWithMonth(document.querySelectorAll(".month-hover")[currentMonthIndex].textContent.trim());

    // Function to fetch events from the backend
    function fetchEvents(start, end) {
        return fetch(`http://localhost:9090/api/calendar/events?start=${start.toISOString()}&end=${end.toISOString()}`)
            .then(response => response.json())
            .then(data => {
                console.log("Events:", data);
                return data;
            })
            .catch(error => console.error("Error fetching events:", error));
    }

    // Function to fetch events for the selected month
    function fetchEventsForMonth(year, monthIndex) {
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 0);
        fetchEvents(start, end).then(events => {
            markDatesWithEvents(events);
        });
    }

    // Function to mark dates that have events
    function markDatesWithEvents(events) {
        events.forEach(event => {
            const eventDate = new Date(event.start).getDate();
            document.querySelectorAll(".date-hover").forEach(dateElement => {
                if (parseInt(dateElement.textContent.trim()) === eventDate) {
                    dateElement.innerHTML += '<span class="event-dot"></span>';
                }
            });
        });
    }

    // Function to create a new event
    function createEvent(date, eventText) {
        const selectedMonthIndex = getSelectedMonthIndex();
        const start = new Date(currentYear, selectedMonthIndex, date);
        const end = new Date(currentYear, selectedMonthIndex, date);

        const eventDetails = {
            start: start.toISOString(),
            end: end.toISOString(),
            text: eventText
        };

        fetch('http://localhost:9090/api/calendar/events/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventDetails)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Event created:", data);
                markDatesWithEvents([data]);
                fetchEventsForMonth(currentYear, selectedMonthIndex); // Refresh events
            })
            .catch(error => console.error("Error creating event:", error));
    }

    // Function to edit an event
    function editEvent(eventId, newText) {
        const eventDetails = {
            id: eventId,                      // Event ID to edit
            text: newText                     // New text for the event
        };

        fetch('http://localhost:9090/api/calendar/events/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventDetails)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Event edited:", data);
                fetchEventsForMonth(currentYear, getSelectedMonthIndex()); // Refresh events
            })
            .catch(error => console.error("Error editing event:", error));
    }

    // Function to delete an event
    function deleteEvent(eventId) {
        const eventDetails = {
            id: eventId // Event ID to delete
        };

        fetch('http://localhost:9090/api/calendar/events/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventDetails)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Event deleted:", data);
                fetchEventsForMonth(currentYear, getSelectedMonthIndex()); // Refresh events
            })
            .catch(error => console.error("Error deleting event:", error));
    }

    // Function to display events in the green box
    function displayEvents(events) {
        eventsBox.innerHTML = ""; // Clear the current content
        if (events.length === 0) {
            eventsBox.textContent = "No events for the selected month.";
        } else {
            events.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.textContent = `${new Date(event.start).toLocaleDateString()} - ${event.text}`;

                // Create edit button
                const editButton = document.createElement("button");
                editButton.textContent = "✎"; // Unicode for pencil icon
                editButton.style.marginRight = "10px";
                editButton.addEventListener("click", () => {
                    const newText = prompt("Edit event details:", event.text);
                    if (newText) {
                        editEvent(event.id, newText);
                    }
                });

                // Create delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "✕"; // Unicode for 'x' icon
                deleteButton.addEventListener("click", () => {
                    deleteEvent(event.id);
                });

                // Append buttons to the event element
                eventElement.appendChild(editButton);
                eventElement.appendChild(deleteButton);

                // Append event element to the events box
                eventsBox.appendChild(eventElement);
            });
        }
        eventsBox.style.display = "block"; // Show the green box
    }
});
