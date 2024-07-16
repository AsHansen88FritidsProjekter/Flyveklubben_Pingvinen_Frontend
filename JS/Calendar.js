document.addEventListener("DOMContentLoaded", function() {
    // Set the current year
    const yearElement = document.querySelector(".year");
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;

    // Create buttons for create, edit, and delete functionalities
    const createEventButton = document.querySelector(".create-event");
    const editEventButton = document.createElement("button");
    const deleteEventButton = document.createElement("button");

    editEventButton.textContent = "Edit Event";
    deleteEventButton.textContent = "Delete Event";

    // Append buttons to the calendar-left div
    const calendarLeft = document.querySelector(".calendar-left");
    calendarLeft.appendChild(editEventButton);
    calendarLeft.appendChild(deleteEventButton);

    // Event listeners for the buttons
    createEventButton.addEventListener("click", function() {
        alert("Create event button clicked");
        // Add your create event logic here
    });

    editEventButton.addEventListener("click", function() {
        alert("Edit event button clicked");
        // Add your edit event logic here
    });

    deleteEventButton.addEventListener("click", function() {
        alert("Delete event button clicked");
        // Add your delete event logic here
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
        if (today.getMonth() === selectedMonthIndex) {
            const currentDate = today.getDate();
            highlightDate(currentDate);
            updateLeftContainerWithDate(currentDate);
        } else {
            // Clear the date if the current month is not selected
            document.querySelector(".num-date").textContent = "";
            document.querySelector(".day").textContent = "";
        }
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
        const selectedMonth = document.querySelector(".selected-month").textContent.trim();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(selectedMonth);
    }

    // Initialize the calendar with the current month
    const currentMonthIndex = new Date().getMonth();
    document.querySelectorAll(".month-hover")[currentMonthIndex].classList.add("selected-month");
    updateCalendarWithMonth(document.querySelectorAll(".month-hover")[currentMonthIndex].textContent.trim());
});
