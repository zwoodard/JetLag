/**
 * JetLag Planner - Main Application
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Populate timezone selects
    populateTimezoneSelects();

    // Set default home timezone
    const homeTimezoneSelect = document.getElementById('home-timezone');
    const detectedTz = detectUserTimezone();
    if (homeTimezoneSelect) {
        homeTimezoneSelect.value = detectedTz;
    }

    // Set default datetime for first flight (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    // Add first flight
    addFlight();

    // Event listeners
    document.getElementById('add-flight-btn').addEventListener('click', addFlight);
    document.getElementById('generate-btn').addEventListener('click', generatePlan);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
}

let flightCount = 0;

function addFlight() {
    const template = document.getElementById('flight-template');
    const container = document.getElementById('flights-container');

    const flightCard = template.content.cloneNode(true);
    const card = flightCard.querySelector('.flight-card');

    flightCount++;
    card.dataset.flightIndex = flightCount;
    card.querySelector('.flight-number').textContent = flightCount;

    // Populate timezone selects
    const tzSelects = card.querySelectorAll('select');
    tzSelects.forEach(select => {
        select.innerHTML = '<option value="">Select timezone...</option>';
        TIMEZONES.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.id;
            option.textContent = tz.name;
            option.dataset.offset = tz.offset;
            select.appendChild(option);
        });
    });

    // Set default date/time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const arrivalTime = new Date(tomorrow);
    arrivalTime.setHours(arrivalTime.getHours() + 8); // 8 hour flight default

    card.querySelector('.departure-datetime').value = formatDateTimeLocal(tomorrow);
    card.querySelector('.arrival-datetime').value = formatDateTimeLocal(arrivalTime);

    // Auto-fill timezone from airport code
    const departureAirport = card.querySelector('.departure-airport');
    const arrivalAirport = card.querySelector('.arrival-airport');
    const departureTz = card.querySelector('.departure-timezone');
    const arrivalTz = card.querySelector('.arrival-timezone');

    departureAirport.addEventListener('blur', () => {
        const tz = getTimezoneFromAirport(departureAirport.value);
        if (tz) departureTz.value = tz;
    });

    arrivalAirport.addEventListener('blur', () => {
        const tz = getTimezoneFromAirport(arrivalAirport.value);
        if (tz) arrivalTz.value = tz;
    });

    // Remove flight button
    card.querySelector('.remove-flight').addEventListener('click', () => {
        card.remove();
        renumberFlights();
    });

    container.appendChild(flightCard);
}

function renumberFlights() {
    const cards = document.querySelectorAll('.flight-card');
    cards.forEach((card, index) => {
        card.dataset.flightIndex = index + 1;
        card.querySelector('.flight-number').textContent = index + 1;
    });
    flightCount = cards.length;
}

function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function collectFlightData() {
    const flights = [];
    const cards = document.querySelectorAll('.flight-card');

    cards.forEach(card => {
        flights.push({
            departureAirport: card.querySelector('.departure-airport').value.toUpperCase(),
            arrivalAirport: card.querySelector('.arrival-airport').value.toUpperCase(),
            departureDateTime: card.querySelector('.departure-datetime').value,
            departureTimezone: card.querySelector('.departure-timezone').value,
            arrivalDateTime: card.querySelector('.arrival-datetime').value,
            arrivalTimezone: card.querySelector('.arrival-timezone').value,
        });
    });

    return flights;
}

function validateFlights(flights) {
    const errors = [];

    flights.forEach((flight, index) => {
        const num = index + 1;
        if (!flight.departureDateTime) {
            errors.push(`Flight ${num}: Departure date/time is required`);
        }
        if (!flight.departureTimezone) {
            errors.push(`Flight ${num}: Departure timezone is required`);
        }
        if (!flight.arrivalDateTime) {
            errors.push(`Flight ${num}: Arrival date/time is required`);
        }
        if (!flight.arrivalTimezone) {
            errors.push(`Flight ${num}: Arrival timezone is required`);
        }
    });

    return errors;
}

function generatePlan() {
    const flights = collectFlightData();

    // Validate
    const errors = validateFlights(flights);
    if (errors.length > 0) {
        alert('Please fix the following:\n\n' + errors.join('\n'));
        return;
    }

    // Collect user profile
    const config = {
        homeTimezone: document.getElementById('home-timezone').value,
        usualBedtime: document.getElementById('usual-bedtime').value,
        usualWaketime: document.getElementById('usual-waketime').value,
        flights: flights,
        daysBeforeStart: parseInt(document.getElementById('plan-start').value),
    };

    // Generate plan
    const plan = createJetLagPlan(config);

    if (plan.error) {
        alert('Error generating plan: ' + plan.error);
        return;
    }

    // Display results
    displayPlan(plan);
}

function displayPlan(plan) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('hidden');

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Summary
    const summaryHtml = `
        <h3>Trip Summary</h3>
        <p>
            Traveling <strong>${plan.summary.direction}ward</strong> with a
            <strong>${plan.summary.totalShiftHours.toFixed(1)} hour</strong> time zone change.
        </p>
        <div class="summary-stats">
            <div class="stat">
                <div class="stat-value">${plan.summary.totalShiftHours.toFixed(1)}h</div>
                <div class="stat-label">Time Shift</div>
            </div>
            <div class="stat">
                <div class="stat-value">${plan.summary.daysToAdjust}</div>
                <div class="stat-label">Days to Adjust</div>
            </div>
            <div class="stat">
                <div class="stat-value">${plan.summary.direction === 'east' ? '→' : '←'}</div>
                <div class="stat-label">${plan.summary.direction === 'east' ? 'Eastward' : 'Westward'}</div>
            </div>
        </div>
    `;
    document.getElementById('plan-summary').innerHTML = summaryHtml;

    // Timeline view
    renderTimeline(plan.schedule);

    // Daily view
    renderDailyView(plan.schedule);
}

function renderTimeline(schedule) {
    const container = document.getElementById('timeline-view');

    const legendHtml = `
        <div class="legend">
            <div class="legend-item"><div class="legend-color" style="background: var(--color-sleep)"></div> Sleep</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-light-seek)"></div> Seek Light</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-light-avoid); border: 2px dashed var(--color-text-muted)"></div> Avoid Light</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-caffeine)"></div> Caffeine OK</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-melatonin)"></div> Melatonin</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-nap)"></div> Optional Nap</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-flight)"></div> Flight</div>
        </div>
    `;

    let html = legendHtml;

    schedule.forEach(day => {
        const dateStr = day.date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        html += `
            <div class="timeline-day">
                <div class="timeline-day-header">
                    <span class="timeline-day-title">${day.dayLabel}</span>
                    <span class="timeline-day-date">${dateStr}</span>
                </div>
                <div class="timeline-bar">
                    ${renderTimelineEvents(day.events)}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderTimelineEvents(events) {
    let html = '';

    events.forEach(event => {
        let startMins = ((event.startTime % 1440) + 1440) % 1440;
        let endMins = ((event.endTime % 1440) + 1440) % 1440;

        // Handle overnight events
        if (event.type === 'sleep' && endMins < startMins) {
            // Split into two parts: evening and morning
            // Evening part (startMins to midnight)
            const eveningWidth = ((1440 - startMins) / 1440) * 100;
            const eveningLeft = (startMins / 1440) * 100;
            html += `<div class="timeline-event ${event.type}" style="left: ${eveningLeft}%; width: ${eveningWidth}%;" title="${event.description}"></div>`;

            // Morning part (midnight to endMins)
            const morningWidth = (endMins / 1440) * 100;
            html += `<div class="timeline-event ${event.type}" style="left: 0%; width: ${morningWidth}%;" title="${event.description}"></div>`;
            return;
        }

        const left = (startMins / 1440) * 100;
        const width = Math.max(((endMins - startMins) / 1440) * 100, 1.5);

        const label = getEventLabel(event.type);
        html += `<div class="timeline-event ${event.type}" style="left: ${left}%; width: ${width}%;" title="${event.description}">${width > 5 ? label : ''}</div>`;
    });

    return html;
}

function getEventLabel(type) {
    const labels = {
        'sleep': 'Sleep',
        'light-seek': 'Light',
        'light-avoid': 'Dim',
        'caffeine': 'Caffeine OK',
        'melatonin': 'Mel',
        'nap': 'Nap',
        'flight': 'Flight',
    };
    return labels[type] || type;
}

function renderDailyView(schedule) {
    const container = document.getElementById('daily-view');
    let html = '';

    schedule.forEach(day => {
        const dateStr = day.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });

        html += `
            <div class="daily-schedule">
                <div class="daily-header">${day.dayLabel} - ${dateStr}</div>
        `;

        // Sort events by start time for display
        const sortedEvents = [...day.events].sort((a, b) => {
            const aTime = ((a.startTime % 1440) + 1440) % 1440;
            const bTime = ((b.startTime % 1440) + 1440) % 1440;
            return aTime - bTime;
        });

        sortedEvents.forEach(event => {
            const startTime = formatTimeDisplay(event.startTime);
            const endTime = formatTimeDisplay(event.endTime);
            const timeRange = event.type === 'melatonin'
                ? startTime
                : `${startTime} - ${endTime}`;

            html += `
                <div class="daily-item">
                    <div class="daily-time">${timeRange}</div>
                    <div class="daily-activity">
                        <span class="activity-type ${event.type}">${getEventLabel(event.type)}</span>
                        <div class="activity-description">${event.description}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
    });

    container.innerHTML = html;
}

function formatTimeDisplay(minutes) {
    const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
    const hours = Math.floor(normalizedMinutes / 60);
    const mins = Math.round(normalizedMinutes % 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-view`);
    });
}
