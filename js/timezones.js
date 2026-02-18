// Common timezone data with UTC offsets
const TIMEZONES = [
    { id: 'Pacific/Midway', name: 'Midway Island (UTC-11:00)', offset: -11 },
    { id: 'Pacific/Honolulu', name: 'Hawaii (UTC-10:00)', offset: -10 },
    { id: 'America/Anchorage', name: 'Alaska (UTC-09:00)', offset: -9 },
    { id: 'America/Los_Angeles', name: 'Pacific Time - Los Angeles (UTC-08:00)', offset: -8 },
    { id: 'America/Phoenix', name: 'Arizona (UTC-07:00)', offset: -7 },
    { id: 'America/Denver', name: 'Mountain Time - Denver (UTC-07:00)', offset: -7 },
    { id: 'America/Chicago', name: 'Central Time - Chicago (UTC-06:00)', offset: -6 },
    { id: 'America/New_York', name: 'Eastern Time - New York (UTC-05:00)', offset: -5 },
    { id: 'America/Caracas', name: 'Caracas (UTC-04:00)', offset: -4 },
    { id: 'America/Halifax', name: 'Atlantic Time - Halifax (UTC-04:00)', offset: -4 },
    { id: 'America/Sao_Paulo', name: 'Sao Paulo (UTC-03:00)', offset: -3 },
    { id: 'America/Buenos_Aires', name: 'Buenos Aires (UTC-03:00)', offset: -3 },
    { id: 'Atlantic/South_Georgia', name: 'Mid-Atlantic (UTC-02:00)', offset: -2 },
    { id: 'Atlantic/Azores', name: 'Azores (UTC-01:00)', offset: -1 },
    { id: 'UTC', name: 'UTC (UTC+00:00)', offset: 0 },
    { id: 'Europe/London', name: 'London (UTC+00:00)', offset: 0 },
    { id: 'Europe/Paris', name: 'Paris, Berlin (UTC+01:00)', offset: 1 },
    { id: 'Europe/Athens', name: 'Athens, Cairo (UTC+02:00)', offset: 2 },
    { id: 'Africa/Johannesburg', name: 'Johannesburg (UTC+02:00)', offset: 2 },
    { id: 'Europe/Moscow', name: 'Moscow (UTC+03:00)', offset: 3 },
    { id: 'Asia/Dubai', name: 'Dubai (UTC+04:00)', offset: 4 },
    { id: 'Asia/Karachi', name: 'Karachi (UTC+05:00)', offset: 5 },
    { id: 'Asia/Kolkata', name: 'Mumbai, Delhi (UTC+05:30)', offset: 5.5 },
    { id: 'Asia/Dhaka', name: 'Dhaka (UTC+06:00)', offset: 6 },
    { id: 'Asia/Bangkok', name: 'Bangkok (UTC+07:00)', offset: 7 },
    { id: 'Asia/Singapore', name: 'Singapore (UTC+08:00)', offset: 8 },
    { id: 'Asia/Hong_Kong', name: 'Hong Kong (UTC+08:00)', offset: 8 },
    { id: 'Asia/Shanghai', name: 'Beijing, Shanghai (UTC+08:00)', offset: 8 },
    { id: 'Asia/Tokyo', name: 'Tokyo (UTC+09:00)', offset: 9 },
    { id: 'Asia/Seoul', name: 'Seoul (UTC+09:00)', offset: 9 },
    { id: 'Australia/Adelaide', name: 'Adelaide (UTC+09:30)', offset: 9.5 },
    { id: 'Australia/Sydney', name: 'Sydney (UTC+10:00)', offset: 10 },
    { id: 'Pacific/Noumea', name: 'Noumea (UTC+11:00)', offset: 11 },
    { id: 'Pacific/Auckland', name: 'Auckland (UTC+12:00)', offset: 12 },
    { id: 'Pacific/Fiji', name: 'Fiji (UTC+12:00)', offset: 12 },
];

// Common airport codes with their timezones
const AIRPORTS = {
    // North America
    'JFK': { name: 'New York JFK', timezone: 'America/New_York', offset: -5 },
    'LGA': { name: 'New York LaGuardia', timezone: 'America/New_York', offset: -5 },
    'EWR': { name: 'Newark', timezone: 'America/New_York', offset: -5 },
    'LAX': { name: 'Los Angeles', timezone: 'America/Los_Angeles', offset: -8 },
    'SFO': { name: 'San Francisco', timezone: 'America/Los_Angeles', offset: -8 },
    'ORD': { name: 'Chicago O\'Hare', timezone: 'America/Chicago', offset: -6 },
    'DFW': { name: 'Dallas/Fort Worth', timezone: 'America/Chicago', offset: -6 },
    'ATL': { name: 'Atlanta', timezone: 'America/New_York', offset: -5 },
    'MIA': { name: 'Miami', timezone: 'America/New_York', offset: -5 },
    'SEA': { name: 'Seattle', timezone: 'America/Los_Angeles', offset: -8 },
    'DEN': { name: 'Denver', timezone: 'America/Denver', offset: -7 },
    'BOS': { name: 'Boston', timezone: 'America/New_York', offset: -5 },
    'IAD': { name: 'Washington Dulles', timezone: 'America/New_York', offset: -5 },
    'DCA': { name: 'Washington Reagan', timezone: 'America/New_York', offset: -5 },
    'YYZ': { name: 'Toronto', timezone: 'America/New_York', offset: -5 },
    'YVR': { name: 'Vancouver', timezone: 'America/Los_Angeles', offset: -8 },
    'MEX': { name: 'Mexico City', timezone: 'America/Chicago', offset: -6 },

    // Europe
    'LHR': { name: 'London Heathrow', timezone: 'Europe/London', offset: 0 },
    'LGW': { name: 'London Gatwick', timezone: 'Europe/London', offset: 0 },
    'CDG': { name: 'Paris Charles de Gaulle', timezone: 'Europe/Paris', offset: 1 },
    'ORY': { name: 'Paris Orly', timezone: 'Europe/Paris', offset: 1 },
    'FRA': { name: 'Frankfurt', timezone: 'Europe/Paris', offset: 1 },
    'AMS': { name: 'Amsterdam', timezone: 'Europe/Paris', offset: 1 },
    'MAD': { name: 'Madrid', timezone: 'Europe/Paris', offset: 1 },
    'BCN': { name: 'Barcelona', timezone: 'Europe/Paris', offset: 1 },
    'FCO': { name: 'Rome Fiumicino', timezone: 'Europe/Paris', offset: 1 },
    'MXP': { name: 'Milan Malpensa', timezone: 'Europe/Paris', offset: 1 },
    'MUC': { name: 'Munich', timezone: 'Europe/Paris', offset: 1 },
    'ZRH': { name: 'Zurich', timezone: 'Europe/Paris', offset: 1 },
    'VIE': { name: 'Vienna', timezone: 'Europe/Paris', offset: 1 },
    'CPH': { name: 'Copenhagen', timezone: 'Europe/Paris', offset: 1 },
    'ARN': { name: 'Stockholm', timezone: 'Europe/Paris', offset: 1 },
    'OSL': { name: 'Oslo', timezone: 'Europe/Paris', offset: 1 },
    'HEL': { name: 'Helsinki', timezone: 'Europe/Athens', offset: 2 },
    'ATH': { name: 'Athens', timezone: 'Europe/Athens', offset: 2 },
    'IST': { name: 'Istanbul', timezone: 'Europe/Athens', offset: 3 },
    'SVO': { name: 'Moscow Sheremetyevo', timezone: 'Europe/Moscow', offset: 3 },
    'DME': { name: 'Moscow Domodedovo', timezone: 'Europe/Moscow', offset: 3 },

    // Middle East
    'DXB': { name: 'Dubai', timezone: 'Asia/Dubai', offset: 4 },
    'AUH': { name: 'Abu Dhabi', timezone: 'Asia/Dubai', offset: 4 },
    'DOH': { name: 'Doha', timezone: 'Asia/Dubai', offset: 3 },
    'TLV': { name: 'Tel Aviv', timezone: 'Europe/Athens', offset: 2 },

    // Asia
    'DEL': { name: 'Delhi', timezone: 'Asia/Kolkata', offset: 5.5 },
    'BOM': { name: 'Mumbai', timezone: 'Asia/Kolkata', offset: 5.5 },
    'BLR': { name: 'Bangalore', timezone: 'Asia/Kolkata', offset: 5.5 },
    'SIN': { name: 'Singapore', timezone: 'Asia/Singapore', offset: 8 },
    'HKG': { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 8 },
    'PEK': { name: 'Beijing', timezone: 'Asia/Shanghai', offset: 8 },
    'PVG': { name: 'Shanghai Pudong', timezone: 'Asia/Shanghai', offset: 8 },
    'NRT': { name: 'Tokyo Narita', timezone: 'Asia/Tokyo', offset: 9 },
    'HND': { name: 'Tokyo Haneda', timezone: 'Asia/Tokyo', offset: 9 },
    'ICN': { name: 'Seoul Incheon', timezone: 'Asia/Seoul', offset: 9 },
    'BKK': { name: 'Bangkok', timezone: 'Asia/Bangkok', offset: 7 },
    'KUL': { name: 'Kuala Lumpur', timezone: 'Asia/Singapore', offset: 8 },
    'TPE': { name: 'Taipei', timezone: 'Asia/Shanghai', offset: 8 },
    'MNL': { name: 'Manila', timezone: 'Asia/Shanghai', offset: 8 },

    // Oceania
    'SYD': { name: 'Sydney', timezone: 'Australia/Sydney', offset: 10 },
    'MEL': { name: 'Melbourne', timezone: 'Australia/Sydney', offset: 10 },
    'BNE': { name: 'Brisbane', timezone: 'Australia/Sydney', offset: 10 },
    'AKL': { name: 'Auckland', timezone: 'Pacific/Auckland', offset: 12 },

    // Africa
    'JNB': { name: 'Johannesburg', timezone: 'Africa/Johannesburg', offset: 2 },
    'CPT': { name: 'Cape Town', timezone: 'Africa/Johannesburg', offset: 2 },
    'CAI': { name: 'Cairo', timezone: 'Europe/Athens', offset: 2 },

    // South America
    'GRU': { name: 'Sao Paulo', timezone: 'America/Sao_Paulo', offset: -3 },
    'EZE': { name: 'Buenos Aires', timezone: 'America/Buenos_Aires', offset: -3 },
    'BOG': { name: 'Bogota', timezone: 'America/New_York', offset: -5 },
    'SCL': { name: 'Santiago', timezone: 'America/Sao_Paulo', offset: -3 },
    'LIM': { name: 'Lima', timezone: 'America/New_York', offset: -5 },
};

// Populate timezone select elements
function populateTimezoneSelects() {
    const selects = document.querySelectorAll('select[id$="-timezone"], select.departure-timezone, select.arrival-timezone');
    selects.forEach(select => {
        if (select.options.length > 1) return; // Already populated

        select.innerHTML = '<option value="">Select timezone...</option>';
        TIMEZONES.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.id;
            option.textContent = tz.name;
            option.dataset.offset = tz.offset;
            select.appendChild(option);
        });
    });
}

// Get timezone offset from timezone ID or airport code
// If a date is provided, computes the actual offset for that date (DST-aware)
function getTimezoneOffset(timezoneIdOrAirport, date) {
    // Resolve to IANA timezone ID
    const tzId = resolveTimezoneId(timezoneIdOrAirport);

    // Try dynamic offset if date is provided
    if (date && tzId) {
        const dynamic = getDynamicOffset(tzId, date);
        if (dynamic !== null) return dynamic;
    }

    // Fallback to static offset
    const airport = AIRPORTS[timezoneIdOrAirport.toUpperCase?.() || ''];
    if (airport) return airport.offset;

    const tz = TIMEZONES.find(t => t.id === timezoneIdOrAirport);
    return tz ? tz.offset : null;
}

// Resolve an airport code or timezone ID to an IANA timezone ID
function resolveTimezoneId(timezoneIdOrAirport) {
    if (!timezoneIdOrAirport) return null;
    const airport = AIRPORTS[timezoneIdOrAirport.toUpperCase?.() || ''];
    if (airport) return airport.timezone;
    const tz = TIMEZONES.find(t => t.id === timezoneIdOrAirport);
    return tz ? tz.id : timezoneIdOrAirport; // Assume it's already an IANA ID
}

// Compute the actual UTC offset for a timezone at a specific date (DST-aware)
function getDynamicOffset(timezoneId, date) {
    try {
        const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: timezoneId,
            timeZoneName: 'longOffset',
        });
        const parts = fmt.formatToParts(date instanceof Date ? date : new Date(date));
        const tzPart = parts.find(p => p.type === 'timeZoneName');
        if (!tzPart) return null;
        if (tzPart.value === 'GMT') return 0;
        const match = tzPart.value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
        if (match) {
            const sign = match[1] === '+' ? 1 : -1;
            return sign * (parseInt(match[2]) + parseInt(match[3] || '0') / 60);
        }
        return null;
    } catch (e) {
        return null;
    }
}

// Get timezone from airport code
function getTimezoneFromAirport(code) {
    const airport = AIRPORTS[code.toUpperCase()];
    return airport ? airport.timezone : null;
}

// Auto-detect user's timezone
function detectUserTimezone() {
    try {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const match = TIMEZONES.find(tz => tz.id === userTz);
        return match ? match.id : 'America/New_York';
    } catch (e) {
        return 'America/New_York';
    }
}
