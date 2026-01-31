/**
 * JetLag Planner - Main Application
 */

const STORAGE_KEY = 'jetlag-planner-data';

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

    // Try to load saved data
    const savedData = loadFromStorage();
    if (savedData) {
        restoreSavedData(savedData);
        showSavedIndicator();
    } else {
        // Add first flight with defaults
        addFlight();
    }

    // Event listeners
    document.getElementById('add-flight-btn').addEventListener('click', () => {
        addFlight();
        saveToStorage();
    });
    document.getElementById('generate-btn').addEventListener('click', generatePlan);

    // Auto-save on input changes
    document.addEventListener('change', (e) => {
        if (e.target.closest('#profile-section, #flights-section, #generate-section')) {
            saveToStorage();
        }
    });

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

// ============ Local Storage ============

function saveToStorage() {
    const data = {
        homeTimezone: document.getElementById('home-timezone').value,
        usualBedtime: document.getElementById('usual-bedtime').value,
        usualWaketime: document.getElementById('usual-waketime').value,
        daysBeforeStart: document.getElementById('plan-start').value,
        flights: collectFlightData(),
        savedAt: new Date().toISOString(),
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
        return null;
    }
}

function restoreSavedData(data) {
    // Restore profile
    if (data.homeTimezone) {
        document.getElementById('home-timezone').value = data.homeTimezone;
    }
    if (data.usualBedtime) {
        document.getElementById('usual-bedtime').value = data.usualBedtime;
    }
    if (data.usualWaketime) {
        document.getElementById('usual-waketime').value = data.usualWaketime;
    }
    if (data.daysBeforeStart) {
        document.getElementById('plan-start').value = data.daysBeforeStart;
    }

    // Restore flights
    if (data.flights && data.flights.length > 0) {
        data.flights.forEach((flight, index) => {
            addFlight(flight);
        });
    } else {
        addFlight();
    }
}

function showSavedIndicator() {
    const header = document.querySelector('#flights-section h2');
    if (header && !header.querySelector('.saved-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'saved-indicator';
        indicator.textContent = 'Restored';
        header.appendChild(indicator);

        // Fade out after 3 seconds
        setTimeout(() => {
            indicator.style.transition = 'opacity 0.5s';
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 500);
        }, 3000);
    }
}

function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.warn('Could not clear localStorage:', e);
    }
}

// ============ Flight Management ============

let flightCount = 0;

function addFlight(flightData = null) {
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

    // Set values from saved data or defaults
    if (flightData) {
        card.querySelector('.departure-airport').value = flightData.departureAirport || '';
        card.querySelector('.arrival-airport').value = flightData.arrivalAirport || '';
        card.querySelector('.departure-datetime').value = flightData.departureDateTime || '';
        card.querySelector('.departure-timezone').value = flightData.departureTimezone || '';
        card.querySelector('.arrival-datetime').value = flightData.arrivalDateTime || '';
        card.querySelector('.arrival-timezone').value = flightData.arrivalTimezone || '';
    } else {
        // Set default date/time
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        const arrivalTime = new Date(tomorrow);
        arrivalTime.setHours(arrivalTime.getHours() + 8);

        card.querySelector('.departure-datetime').value = formatDateTimeLocal(tomorrow);
        card.querySelector('.arrival-datetime').value = formatDateTimeLocal(arrivalTime);
    }

    // Auto-fill timezone from airport code
    const departureAirport = card.querySelector('.departure-airport');
    const arrivalAirport = card.querySelector('.arrival-airport');
    const departureTz = card.querySelector('.departure-timezone');
    const arrivalTz = card.querySelector('.arrival-timezone');

    departureAirport.addEventListener('blur', () => {
        const tz = getTimezoneFromAirport(departureAirport.value);
        if (tz) {
            departureTz.value = tz;
            saveToStorage();
        }
    });

    arrivalAirport.addEventListener('blur', () => {
        const tz = getTimezoneFromAirport(arrivalAirport.value);
        if (tz) {
            arrivalTz.value = tz;
            saveToStorage();
        }
    });

    // Remove flight button
    card.querySelector('.remove-flight').addEventListener('click', () => {
        card.remove();
        renumberFlights();
        saveToStorage();
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

// ============ Plan Generation ============

function generatePlan() {
    const flights = collectFlightData();

    // Validate
    const errors = validateFlights(flights);
    if (errors.length > 0) {
        alert('Please fix the following:\n\n' + errors.join('\n'));
        return;
    }

    // Save before generating
    saveToStorage();

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

    // Update header with regenerate button
    const resultsCard = resultsSection;
    let header = resultsCard.querySelector('.results-header');
    if (!header) {
        const h2 = resultsCard.querySelector('h2');
        header = document.createElement('div');
        header.className = 'results-header';
        header.innerHTML = `<h2>${h2.innerHTML}</h2>`;
        h2.replaceWith(header);
    }

    // Add regenerate button if not present
    if (!header.querySelector('.btn-ghost')) {
        const regenBtn = document.createElement('button');
        regenBtn.type = 'button';
        regenBtn.className = 'btn btn-ghost btn-small';
        regenBtn.textContent = 'Regenerate';
        regenBtn.addEventListener('click', generatePlan);
        header.appendChild(regenBtn);
    }

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
                <div class="stat-value">${plan.summary.direction === 'east' ? '&#8599;' : '&#8598;'}</div>
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

// ============ Timeline Rendering ============

function renderTimeline(schedule) {
    const container = document.getElementById('timeline-view');

    const legendHtml = `
        <div class="legend">
            <div class="legend-item"><div class="legend-color" style="background: var(--color-sleep)"></div> Sleep</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-light-seek)"></div> Seek Light</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-light-avoid); border: 2px dashed var(--color-text-muted)"></div> Avoid Light</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-caffeine)"></div> Caffeine OK</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-melatonin)"></div> Melatonin</div>
            <div class="legend-item"><div class="legend-color" style="background: var(--color-nap)"></div> Nap</div>
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
                <div class="timeline-vertical">
                    ${renderVerticalTimeline(day.events)}
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
            // Evening part
            const eveningWidth = ((1440 - startMins) / 1440) * 100;
            const eveningLeft = (startMins / 1440) * 100;
            html += `<div class="timeline-event ${event.type}" style="left: ${eveningLeft}%; width: ${eveningWidth}%;" title="${event.description}"></div>`;

            // Morning part
            const morningWidth = (endMins / 1440) * 100;
            html += `<div class="timeline-event ${event.type}" style="left: 0%; width: ${morningWidth}%;" title="${event.description}"></div>`;
            return;
        }

        const left = (startMins / 1440) * 100;
        const width = Math.max(((endMins - startMins) / 1440) * 100, 1.5);

        const label = getEventLabel(event.type);
        html += `<div class="timeline-event ${event.type}" style="left: ${left}%; width: ${width}%;" title="${event.description}">${width > 6 ? label : ''}</div>`;
    });

    return html;
}

function renderVerticalTimeline(events) {
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
        const aTime = ((a.startTime % 1440) + 1440) % 1440;
        const bTime = ((b.startTime % 1440) + 1440) % 1440;
        return aTime - bTime;
    });

    let html = '';

    sortedEvents.forEach(event => {
        const startTime = formatTimeDisplay(event.startTime);
        const endTime = formatTimeDisplay(event.endTime);
        const timeRange = event.type === 'melatonin' ? startTime : `${startTime} - ${endTime}`;
        const label = getEventLabel(event.type);

        html += `
            <div class="timeline-vertical-event ${event.type}">
                <div class="timeline-vertical-time">${timeRange}</div>
                <div>
                    <div class="timeline-vertical-label">${label}</div>
                    <div class="timeline-vertical-desc">${event.description}</div>
                </div>
            </div>
        `;
    });

    return html;
}

function getEventLabel(type) {
    const labels = {
        'sleep': 'Sleep',
        'light-seek': 'Seek Light',
        'light-avoid': 'Avoid Light',
        'caffeine': 'Caffeine OK',
        'melatonin': 'Melatonin',
        'nap': 'Nap',
        'flight': 'Flight',
    };
    return labels[type] || type;
}

// ============ Daily View Rendering ============

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

        // Sort events by start time
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
                <div class="daily-item ${event.type}">
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
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-view`);
    });
}
