/**
 * JetLag Planner - Main Application
 */

const STORAGE_KEY = 'jetlag-planner-data';
const URL_PARAM_KEY = 'd'; // Short key for URL param

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

    // Try to load saved data - URL takes priority over localStorage
    const urlData = loadFromURL();
    const savedData = urlData || loadFromStorage();

    if (savedData) {
        restoreSavedData(savedData);
        showSavedIndicator(urlData ? 'Loaded from link' : 'Restored');
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
    document.getElementById('share-btn').addEventListener('click', copyShareLink);

    // Auto-save on input changes (change event for selects/datetime)
    document.addEventListener('change', (e) => {
        if (e.target.closest('#profile-section, #flights-section, #generate-section')) {
            saveToStorage();
        }
    });

    // Also save on input event for text fields (fires on every keystroke)
    document.addEventListener('input', (e) => {
        if (e.target.closest('#profile-section, #flights-section, #generate-section')) {
            // Debounce to avoid excessive saves
            clearTimeout(window.saveTimeout);
            window.saveTimeout = setTimeout(saveToStorage, 500);
        }
    });

    // Save before page unload to catch any unsaved changes
    window.addEventListener('beforeunload', () => {
        saveToStorage();
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

// ============ URL Encoding/Decoding ============

function encodeDataForURL(data) {
    try {
        // Create a minimal data object (exclude savedAt, include only what's needed)
        const minimal = {
            h: data.homeTimezone,           // home timezone
            b: data.usualBedtime,           // bedtime
            w: data.usualWaketime,          // waketime
            d: data.daysBeforeStart,        // days before
            f: data.flights.map(f => ({     // flights (shortened keys)
                da: f.departureAirport,
                aa: f.arrivalAirport,
                dd: f.departureDateTime,
                dt: f.departureTimezone,
                ad: f.arrivalDateTime,
                at: f.arrivalTimezone,
            })),
        };
        const json = JSON.stringify(minimal);
        // Use base64url encoding (URL-safe)
        const base64 = btoa(unescape(encodeURIComponent(json)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        return base64;
    } catch (e) {
        console.warn('[JetLag] Could not encode data for URL:', e);
        return null;
    }
}

function decodeDataFromURL(encoded) {
    try {
        // Restore base64 padding and chars
        let base64 = encoded
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }
        const json = decodeURIComponent(escape(atob(base64)));
        const minimal = JSON.parse(json);

        // Expand back to full format
        return {
            homeTimezone: minimal.h,
            usualBedtime: minimal.b,
            usualWaketime: minimal.w,
            daysBeforeStart: minimal.d,
            flights: minimal.f.map(f => ({
                departureAirport: f.da || '',
                arrivalAirport: f.aa || '',
                departureDateTime: f.dd || '',
                departureTimezone: f.dt || '',
                arrivalDateTime: f.ad || '',
                arrivalTimezone: f.at || '',
            })),
        };
    } catch (e) {
        console.warn('[JetLag] Could not decode data from URL:', e);
        return null;
    }
}

function saveToURL(data) {
    const encoded = encodeDataForURL(data);
    if (encoded) {
        const url = new URL(window.location.href);
        url.searchParams.set(URL_PARAM_KEY, encoded);
        // Use replaceState to avoid cluttering browser history
        window.history.replaceState({}, '', url.toString());
        console.log('[JetLag] Saved to URL');
    }
}

function loadFromURL() {
    try {
        const url = new URL(window.location.href);
        const encoded = url.searchParams.get(URL_PARAM_KEY);
        if (encoded) {
            const data = decodeDataFromURL(encoded);
            if (data) {
                console.log('[JetLag] Loaded from URL:', data.flights?.length, 'flights');
                return data;
            }
        }
        return null;
    } catch (e) {
        console.warn('[JetLag] Could not load from URL:', e);
        return null;
    }
}

function getShareableURL() {
    const data = {
        homeTimezone: document.getElementById('home-timezone').value,
        usualBedtime: document.getElementById('usual-bedtime').value,
        usualWaketime: document.getElementById('usual-waketime').value,
        daysBeforeStart: document.getElementById('plan-start').value,
        flights: collectFlightData(),
    };
    const encoded = encodeDataForURL(data);
    if (encoded) {
        const url = new URL(window.location.href);
        url.searchParams.set(URL_PARAM_KEY, encoded);
        return url.toString();
    }
    return window.location.href;
}

async function copyShareLink() {
    const url = getShareableURL();
    const btn = document.getElementById('share-btn');
    const originalText = btn.textContent;

    try {
        await navigator.clipboard.writeText(url);
        btn.textContent = 'Copied!';
        btn.classList.add('success');
        console.log('[JetLag] Share link copied to clipboard');
    } catch (e) {
        // Fallback for older browsers or if clipboard API fails
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            btn.textContent = 'Copied!';
            btn.classList.add('success');
        } catch (e2) {
            btn.textContent = 'Failed';
            console.warn('[JetLag] Could not copy to clipboard:', e2);
        }
        document.body.removeChild(textArea);
    }

    // Reset button after 2 seconds
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('success');
    }, 2000);
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

    // Save to localStorage
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('[JetLag] Saved to localStorage:', data.flights.length, 'flights');
    } catch (e) {
        console.warn('[JetLag] Could not save to localStorage:', e);
    }

    // Also update URL (debounced in the caller already for input events)
    saveToURL(data);
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            console.log('[JetLag] Loaded from localStorage:', parsed.flights?.length, 'flights, saved at:', parsed.savedAt);
            return parsed;
        }
        console.log('[JetLag] No saved data found in localStorage');
        return null;
    } catch (e) {
        console.warn('[JetLag] Could not load from localStorage:', e);
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

function showSavedIndicator(message = 'Restored') {
    const header = document.querySelector('#flights-section h2');
    if (header && !header.querySelector('.saved-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'saved-indicator';
        indicator.textContent = message;
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

    // Shifter view (Timeshifter-style)
    renderShifterView(plan.schedule, plan.summary);
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

    // Get current time for "Now" indicator
    const now = new Date();
    const todayStr = now.toDateString();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    schedule.forEach(day => {
        const dateStr = day.date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        // Check if this is today
        const isToday = day.date.toDateString() === todayStr;

        // Render horizontal timeline with dynamic height for lanes
        const timelineResult = renderTimelineEvents(day.events);

        html += `
            <div class="timeline-day${isToday ? ' timeline-day-today' : ''}">
                <div class="timeline-day-header">
                    <span class="timeline-day-title">${day.dayLabel}${isToday ? ' <span class="today-badge">Today</span>' : ''}</span>
                    <span class="timeline-day-date">${dateStr}</span>
                </div>
                <div class="timeline-bar" style="height: ${timelineResult.height}px;">
                    ${timelineResult.html}
                    ${isToday ? renderNowIndicator(currentMins) : ''}
                </div>
                <div class="timeline-vertical">
                    ${renderVerticalTimeline(day.events, isToday, currentMins)}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderNowIndicator(currentMins) {
    const position = (currentMins / 1440) * 100;
    const timeStr = formatTimeDisplay(currentMins);
    return `
        <div class="timeline-now" style="left: ${position}%;">
            <div class="timeline-now-line"></div>
            <div class="timeline-now-label">Now ${timeStr}</div>
        </div>
    `;
}

/**
 * Assign events to lanes to handle overlaps.
 * Returns events with a 'lane' property (0, 1, 2, etc.)
 */
function assignLanes(events) {
    // Normalize times and sort by start
    const normalized = events.map(e => {
        let start = ((e.startTime % 1440) + 1440) % 1440;
        let end = ((e.endTime % 1440) + 1440) % 1440;
        // Handle overnight events
        if (e.type === 'sleep' && end < start) {
            end += 1440;
        }
        return { ...e, normStart: start, normEnd: end };
    }).sort((a, b) => a.normStart - b.normStart);

    // Assign lanes - greedy algorithm
    const lanes = []; // Each lane has an 'endTime' of the last event in it

    normalized.forEach(event => {
        // Find the first lane where this event fits (doesn't overlap)
        let assignedLane = -1;
        for (let i = 0; i < lanes.length; i++) {
            if (event.normStart >= lanes[i]) {
                assignedLane = i;
                lanes[i] = event.normEnd;
                break;
            }
        }
        // If no lane fits, create a new one
        if (assignedLane === -1) {
            assignedLane = lanes.length;
            lanes.push(event.normEnd);
        }
        event.lane = assignedLane;
    });

    return { events: normalized, laneCount: lanes.length };
}

function renderTimelineEvents(events) {
    const { events: laneEvents, laneCount } = assignLanes(events);

    // Calculate lane height - shrink if many lanes
    const laneHeight = laneCount <= 2 ? 24 : Math.max(16, 48 / laneCount);
    const totalHeight = laneCount * laneHeight + 8; // 8px padding

    let html = '';

    laneEvents.forEach(event => {
        let startMins = event.normStart;
        let endMins = event.normEnd;

        // Handle overnight events (already normalized, but need to render in two parts if > 1440)
        if (endMins > 1440) {
            // Evening part
            const eveningWidth = ((1440 - startMins) / 1440) * 100;
            const eveningLeft = (startMins / 1440) * 100;
            const top = 4 + event.lane * laneHeight;
            html += `<div class="timeline-event ${event.type}" style="left: ${eveningLeft}%; width: ${eveningWidth}%; top: ${top}px; height: ${laneHeight - 2}px;" title="${event.description}"></div>`;

            // Morning part (next day, but we show it wrapping)
            const morningWidth = ((endMins - 1440) / 1440) * 100;
            html += `<div class="timeline-event ${event.type}" style="left: 0%; width: ${morningWidth}%; top: ${top}px; height: ${laneHeight - 2}px;" title="${event.description}"></div>`;
            return;
        }

        const left = (startMins / 1440) * 100;
        const width = Math.max(((endMins - startMins) / 1440) * 100, 1.5);
        const top = 4 + event.lane * laneHeight;

        const label = getEventLabel(event.type);
        const showLabel = width > 8 && laneHeight >= 20;
        html += `<div class="timeline-event ${event.type}" style="left: ${left}%; width: ${width}%; top: ${top}px; height: ${laneHeight - 2}px;" title="${event.description}">${showLabel ? label : ''}</div>`;
    });

    // Return HTML with dynamic height style
    return { html, height: totalHeight };
}

function renderVerticalTimeline(events, isToday = false, currentMins = 0) {
    // Categorize events: active now, upcoming, past
    const categorized = events.map(event => {
        const start = ((event.startTime % 1440) + 1440) % 1440;
        let end = ((event.endTime % 1440) + 1440) % 1440;
        // Handle overnight
        if (event.type === 'sleep' && end < start) {
            end += 1440;
        }
        const adjustedCurrent = currentMins < start && end > 1440 ? currentMins + 1440 : currentMins;

        let status = 'upcoming';
        if (isToday) {
            if (adjustedCurrent >= start && adjustedCurrent < end) {
                status = 'active';
            } else if (adjustedCurrent >= end) {
                status = 'past';
            }
        }
        return { ...event, normStart: start, normEnd: end, status };
    });

    // Sort: active first, then upcoming by time, then past
    const sorted = categorized.sort((a, b) => {
        const statusOrder = { active: 0, upcoming: 1, past: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.normStart - b.normStart;
    });

    let html = '';
    let lastStatus = null;

    sorted.forEach(event => {
        // Add section headers
        if (isToday && event.status !== lastStatus) {
            if (event.status === 'active') {
                html += `<div class="timeline-section-header active-header">🔴 Happening Now</div>`;
            } else if (event.status === 'upcoming' && lastStatus === 'active') {
                html += `<div class="timeline-section-header">Coming Up</div>`;
            } else if (event.status === 'past' && lastStatus !== 'past') {
                html += `<div class="timeline-section-header past-header">Earlier Today</div>`;
            }
            lastStatus = event.status;
        }

        const startTime = formatTimeDisplay(event.startTime);
        const endTime = formatTimeDisplay(event.endTime);
        const timeRange = event.type === 'melatonin' ? startTime : `${startTime} - ${endTime}`;
        const label = getEventLabel(event.type);

        const activeClass = event.status === 'active' ? ' active-now' : '';
        const pastClass = event.status === 'past' ? ' past-event' : '';

        html += `
            <div class="timeline-vertical-event ${event.type}${activeClass}${pastClass}">
                <div class="timeline-vertical-time">${timeRange}</div>
                <div>
                    <div class="timeline-vertical-label">${label}</div>
                    <div class="timeline-vertical-desc">${event.description}</div>
                </div>
            </div>
        `;
    });

    // Add Now indicator if no active events
    if (isToday && !sorted.some(e => e.status === 'active')) {
        const timeStr = formatTimeDisplay(currentMins);
        html = `
            <div class="timeline-vertical-now standalone">
                <div class="timeline-vertical-now-label">Now ${timeStr}</div>
            </div>
        ` + html;
    }

    return html;
}

// ============ Shifter View (Timeshifter-style) ============

function renderShifterView(schedule, summary) {
    const container = document.getElementById('shifter-view');

    // Get current time for "Now" indicator
    const now = new Date();
    const todayStr = now.toDateString();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    // Preprocess: collect overnight continuations from each day into the next
    const dayEvents = schedule.map(day => [...day.events]);
    for (let i = 0; i < dayEvents.length; i++) {
        dayEvents[i].forEach(event => {
            const start = ((event.startTime % 1440) + 1440) % 1440;
            const end = ((event.endTime % 1440) + 1440) % 1440;
            if (end > 0 && end < start && i + 1 < dayEvents.length) {
                // Event crosses midnight — add continuation to next day
                dayEvents[i + 1].push({
                    ...event,
                    startTime: 0,
                    endTime: end,
                    _continuation: true, // rendering flag only
                });
            }
        });
    }

    let html = '<div class="shifter-container">';

    schedule.forEach((day, dayIndex) => {
        const dateStr = day.date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
        const isToday = day.date.toDateString() === todayStr;

        // Use preprocessed events (includes continuations from previous day)
        const events = dayEvents[dayIndex].sort((a, b) => {
            const aStart = ((a.startTime % 1440) + 1440) % 1440;
            const bStart = ((b.startTime % 1440) + 1440) % 1440;
            return aStart - bStart;
        });

        // Each day spans midnight to midnight — find the active range
        let minTime = 1440, maxTime = 0;
        events.forEach(e => {
            let start = ((e.startTime % 1440) + 1440) % 1440;
            let end = ((e.endTime % 1440) + 1440) % 1440;
            if (end < start) end = 1440; // Clamp overnight at midnight (continuation is on next day)
            minTime = Math.min(minTime, start);
            maxTime = Math.max(maxTime, end);
        });

        // Round to nearest hour, always end at midnight
        const startHour = Math.floor(minTime / 60);
        const endHour = 24; // Always end at midnight
        const hours = [];
        for (let h = startHour; h <= endHour; h++) {
            hours.push(h % 24);
        }

        // Date header
        html += `
            <div class="shifter-day${isToday ? ' shifter-day-today' : ''}">
                <div class="shifter-date-header">
                    <span class="shifter-date">${dateStr}</span>
                    <span class="shifter-label">${day.dayLabel}</span>
                    ${isToday ? '<span class="shifter-now-badge">Now</span>' : ''}
                </div>
                <div class="shifter-timeline">
                    <div class="shifter-hours-left">
                        ${hours.map(h => `<div class="shifter-hour">${formatHour(h)}</div>`).join('')}
                    </div>
                    <div class="shifter-track" data-start-hour="${startHour}" data-end-hour="${endHour}">
                        ${renderShifterEvents(events, startHour, endHour, isToday, currentMins)}
                        ${isToday ? renderShifterNowLine(currentMins, startHour, endHour) : ''}
                    </div>
                    <div class="shifter-hours-right">
                        ${hours.map(h => `<div class="shifter-hour">${formatHour(h)}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';

    // Add event detail popup
    html += `
        <div class="shifter-popup" id="shifter-popup">
            <div class="shifter-popup-content">
                <div class="shifter-popup-header">
                    <span class="shifter-popup-icon"></span>
                    <span class="shifter-popup-title"></span>
                </div>
                <div class="shifter-popup-time"></div>
                <div class="shifter-popup-desc"></div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Add click handlers for events
    container.querySelectorAll('.shifter-event').forEach(el => {
        el.addEventListener('click', (e) => {
            showShifterPopup(el);
            e.stopPropagation();
        });
    });

    // Close popup when clicking outside
    container.addEventListener('click', () => {
        hideShifterPopup();
    });
}

function renderShifterEvents(events, startHour, endHour, isToday, currentMins) {
    const totalMins = (endHour - startHour) * 60;
    const startMins = startHour * 60;

    // Assign columns for overlapping events
    const { events: laneEvents, laneCount } = assignShifterLanes(events, startHour, endHour);

    let html = '';

    laneEvents.forEach(event => {
        let evStart = ((event.startTime % 1440) + 1440) % 1440;
        let evEnd = ((event.endTime % 1440) + 1440) % 1440;

        // Handle overnight events - clamp at midnight (continuation on next day)
        if (evEnd < evStart) {
            evEnd = 1440;
        }

        // Clamp to display range
        evStart = Math.max(evStart, startMins);
        evEnd = Math.min(evEnd, endHour * 60);

        const top = ((evStart - startMins) / totalMins) * 100;
        const height = Math.max(((evEnd - evStart) / totalMins) * 100, 3);

        // Calculate horizontal position based on lane
        const laneWidth = 100 / laneCount;
        const left = event.lane * laneWidth;
        const width = laneWidth - 4; // Gap between lanes

        const icon = getShifterIcon(event.type);
        const isActive = isToday && currentMins >= evStart && currentMins < evEnd;

        // Build data attributes, including timezone info for flights
        let dataAttrs = `data-type="${event.type}"`;
        dataAttrs += ` data-start="${formatTimeDisplay(event.startTime)}"`;
        dataAttrs += ` data-end="${formatTimeDisplay(event.endTime)}"`;
        dataAttrs += ` data-desc="${escapeHtml(event.description)}"`;

        if (event.type === 'flight' && event.flight) {
            dataAttrs += ` data-dep-tz="${event.departureTimezone || ''}"`;
            dataAttrs += ` data-arr-tz="${event.arrivalTimezone || ''}"`;
            dataAttrs += ` data-arr-time="${event.arrivalLocalTime || ''}"`;
            dataAttrs += ` data-duration="${event.durationMins || 0}"`;
            dataAttrs += ` data-tz-shift="${event.timezoneShift || 0}"`;
        }

        html += `
            <div class="shifter-event shifter-event-${event.type}${isActive ? ' active' : ''}"
                 style="top: ${top}%; height: ${height}%; left: ${left}%; width: ${width}%;"
                 ${dataAttrs}>
                <span class="shifter-event-icon">${icon}</span>
            </div>
        `;
    });

    return html;
}

function assignShifterLanes(events, startHour, endHour) {
    const startMins = startHour * 60;
    const endMins = endHour * 60;

    const normalized = events.map(e => {
        let start = ((e.startTime % 1440) + 1440) % 1440;
        let end = ((e.endTime % 1440) + 1440) % 1440;
        if (end < start) end = 1440; // Clamp at midnight (continuation on next day)
        // Clamp to range
        start = Math.max(start, startMins);
        end = Math.min(end, endMins);
        return { ...e, normStart: start, normEnd: end };
    }).filter(e => e.normEnd > e.normStart)
      .sort((a, b) => a.normStart - b.normStart);

    const lanes = [];

    normalized.forEach(event => {
        let assignedLane = -1;
        for (let i = 0; i < lanes.length; i++) {
            if (event.normStart >= lanes[i]) {
                assignedLane = i;
                lanes[i] = event.normEnd;
                break;
            }
        }
        if (assignedLane === -1) {
            assignedLane = lanes.length;
            lanes.push(event.normEnd);
        }
        event.lane = assignedLane;
    });

    return { events: normalized, laneCount: Math.max(1, lanes.length) };
}

function renderShifterNowLine(currentMins, startHour, endHour) {
    const totalMins = (endHour - startHour) * 60;
    const startMins = startHour * 60;

    if (currentMins < startMins || currentMins > endHour * 60) {
        return '';
    }

    const top = ((currentMins - startMins) / totalMins) * 100;

    return `
        <div class="shifter-now-line" style="top: ${top}%;">
            <div class="shifter-now-dot"></div>
            <div class="shifter-now-line-bar"></div>
            <div class="shifter-now-time">${formatTimeDisplay(currentMins)}</div>
        </div>
    `;
}

function getShifterIcon(type) {
    const icons = {
        'sleep': '😴',
        'light-seek': '☀️',
        'light-avoid': '🕶️',
        'caffeine': '☕',
        'melatonin': '💊',
        'nap': '💤',
        'flight': '✈️',
    };
    return icons[type] || '•';
}

function formatHour(hour) {
    if (hour === 0 || hour === 24) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
}

function formatTimezoneShort(tz) {
    if (!tz) return '';
    // Extract short name from timezone ID like "Pacific/Honolulu" -> "HST" or just show offset
    const parts = tz.split('/');
    return parts[parts.length - 1].replace(/_/g, ' ');
}

function showShifterPopup(element) {
    const popup = document.getElementById('shifter-popup');
    const type = element.dataset.type;
    const start = element.dataset.start;
    const end = element.dataset.end;
    const desc = element.dataset.desc;

    popup.querySelector('.shifter-popup-icon').textContent = getShifterIcon(type);
    popup.querySelector('.shifter-popup-title').textContent = getEventLabelText(type);

    // Build time display with timezone info for flights
    let timeText = '';
    if (type === 'flight') {
        const depTz = element.dataset.depTz;
        const arrTz = element.dataset.arrTz;
        const arrTime = element.dataset.arrTime;
        const duration = parseInt(element.dataset.duration) || 0;
        const tzShift = parseInt(element.dataset.tzShift) || 0;

        const durationHrs = Math.floor(duration / 60);
        const durationMins = duration % 60;
        const durationStr = durationMins > 0 ? `${durationHrs}h ${durationMins}m` : `${durationHrs}h`;

        timeText = `Depart: ${start} (${formatTimezoneShort(depTz)})\n`;
        timeText += `Arrive: ${arrTime} (${formatTimezoneShort(arrTz)})\n`;
        timeText += `Duration: ${durationStr}`;

        if (tzShift !== 0) {
            const sign = tzShift > 0 ? '+' : '';
            timeText += `\nTimezone: ${sign}${tzShift}h`;
        }
    } else if (type === 'melatonin') {
        timeText = start;
    } else {
        timeText = `${start} - ${end}`;
    }

    popup.querySelector('.shifter-popup-time').innerText = timeText;
    popup.querySelector('.shifter-popup-desc').textContent = desc;

    popup.classList.add('visible');

    // Position popup near the element
    const rect = element.getBoundingClientRect();
    const popupContent = popup.querySelector('.shifter-popup-content');

    // Position below the element, but ensure it stays in viewport
    let top = rect.bottom + 10;
    let left = Math.max(10, rect.left - 50);

    // Check if popup would go off bottom of screen
    const popupHeight = 150; // Estimate
    if (top + popupHeight > window.innerHeight) {
        top = rect.top - popupHeight - 10;
    }

    // Check if popup would go off right of screen
    const popupWidth = 280;
    if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 10;
    }

    popupContent.style.top = `${top}px`;
    popupContent.style.left = `${left}px`;
}

function hideShifterPopup() {
    const popup = document.getElementById('shifter-popup');
    popup.classList.remove('visible');
}

function getEventLabel(type) {
    const labels = {
        'sleep': '😴 Sleep',
        'light-seek': '☀️ Seek Light',
        'light-avoid': '🕶️ Avoid Light',
        'caffeine': '☕ Caffeine OK',
        'melatonin': '💊 Melatonin',
        'nap': '💤 Nap',
        'flight': '✈️ Flight',
    };
    return labels[type] || type;
}

function getEventLabelText(type) {
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
