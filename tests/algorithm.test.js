/**
 * Algorithm tests - run with: node tests/algorithm.test.js
 */

// Load the algorithm files
const fs = require('fs');
const vm = require('vm');

// Create a context with the required globals
const context = {
    console,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    parseInt,
    parseFloat,
    isNaN,
    Intl,
};
vm.createContext(context);

// Load timezones.js
const timezonesCode = fs.readFileSync('./js/timezones.js', 'utf8');
vm.runInContext(timezonesCode, context);

// Load jet-lag-algorithm.js
const algorithmCode = fs.readFileSync('./js/jet-lag-algorithm.js', 'utf8');
vm.runInContext(algorithmCode, context);

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        testsPassed++;
    } catch (e) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${e.message}`);
        testsFailed++;
    }
}

function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${expected}, got ${actual}`);
            }
        },
        toBeGreaterThan(expected) {
            if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        },
        toBeLessThanOrEqual(expected) {
            if (actual > expected) {
                throw new Error(`Expected ${actual} to be <= ${expected}`);
            }
        },
        toContain(expected) {
            if (!actual.includes(expected)) {
                throw new Error(`Expected array to contain ${expected}`);
            }
        },
        toHaveLength(expected) {
            if (actual.length !== expected) {
                throw new Error(`Expected length ${expected}, got ${actual.length}`);
            }
        },
        toBeTruthy() {
            if (!actual) {
                throw new Error(`Expected truthy value, got ${actual}`);
            }
        },
    };
}

console.log('\n=== JetLag Algorithm Tests ===\n');

// ============ Test: Days Before Start ============
console.log('--- Days Before Start ---\n');

test('daysBeforeStart=0 should only show departure day onwards', () => {
    const config = {
        homeTimezone: 'Pacific/Honolulu',
        usualBedtime: '21:00',
        usualWaketime: '05:00',
        daysBeforeStart: 0,
        flights: [{
            departureAirport: 'HNL',
            arrivalAirport: 'TYO',
            departureDateTime: '2026-01-31T09:00',
            departureTimezone: 'Pacific/Honolulu',
            arrivalDateTime: '2026-02-01T17:00',
            arrivalTimezone: 'Asia/Tokyo',
        }],
    };

    const plan = context.createJetLagPlan(config);

    // Check the first day in schedule
    const firstDay = plan.schedule[0];
    const departureDate = new Date('2026-01-31');

    console.log(`  First day in schedule: ${firstDay.date.toDateString()}`);
    console.log(`  Departure date: ${departureDate.toDateString()}`);
    console.log(`  First day label: ${firstDay.dayLabel}`);

    // The first day should be the departure day, not before
    expect(firstDay.date.getDate()).toBe(departureDate.getDate());
});

test('daysBeforeStart=2 should show 2 days before departure', () => {
    const config = {
        homeTimezone: 'Pacific/Honolulu',
        usualBedtime: '21:00',
        usualWaketime: '05:00',
        daysBeforeStart: 2,
        flights: [{
            departureAirport: 'HNL',
            arrivalAirport: 'TYO',
            departureDateTime: '2026-01-31T09:00',
            departureTimezone: 'Pacific/Honolulu',
            arrivalDateTime: '2026-02-01T17:00',
            arrivalTimezone: 'Asia/Tokyo',
        }],
    };

    const plan = context.createJetLagPlan(config);
    const firstDay = plan.schedule[0];

    console.log(`  First day in schedule: ${firstDay.date.toDateString()}`);
    console.log(`  First day label: ${firstDay.dayLabel}`);

    // Should be Jan 29 (2 days before Jan 31)
    expect(firstDay.date.getDate()).toBe(29);
});

// ============ Test: In-Flight Naps ============
console.log('\n--- In-Flight Naps ---\n');

test('Long flight (HNL-TYO, ~9 hours) should have in-flight sleep', () => {
    const config = {
        homeTimezone: 'Pacific/Honolulu',
        usualBedtime: '21:00',
        usualWaketime: '05:00',
        daysBeforeStart: 0,
        flights: [{
            departureAirport: 'HNL',
            arrivalAirport: 'TYO',
            departureDateTime: '2026-01-31T09:00',
            departureTimezone: 'Pacific/Honolulu',
            arrivalDateTime: '2026-02-01T17:00', // ~9+ hour flight accounting for timezone
            arrivalTimezone: 'Asia/Tokyo',
        }],
    };

    const plan = context.createJetLagPlan(config);

    // Find the day with the flight
    let flightDay = null;
    let flightEvents = [];

    plan.schedule.forEach(day => {
        day.events.forEach(event => {
            if (event.type === 'flight') {
                flightDay = day;
                flightEvents = day.events;
            }
        });
    });

    console.log(`  Flight day: ${flightDay?.date.toDateString()}`);
    console.log(`  Events on flight day:`);
    flightEvents.forEach(e => {
        console.log(`    - ${e.type}: ${e.startTime}-${e.endTime} (${e.description})`);
    });

    // In-flight sleep can be 'nap' (short) or 'sleep' (longer, 2+ hours)
    const inFlightSleep = flightEvents.find(e => (e.type === 'nap' || e.type === 'sleep') && e.inFlight);
    console.log(`  In-flight sleep found: ${inFlightSleep ? 'YES' : 'NO'}`);
    if (inFlightSleep) {
        const durationMins = inFlightSleep.endTime - inFlightSleep.startTime;
        console.log(`  Duration: ${Math.floor(durationMins / 60)}h ${durationMins % 60}m`);
    }

    expect(inFlightSleep).toBeTruthy();
});

test('Flight duration calculation for cross-timezone flight', () => {
    // HNL 9:00 AM on Jan 31 = UTC 19:00 on Jan 31
    // TYO 5:00 PM on Feb 1 = UTC 08:00 on Feb 1
    // Duration = 13 hours

    const depTime = new Date('2026-01-31T09:00:00-10:00'); // Hawaii time
    const arrTime = new Date('2026-02-01T17:00:00+09:00'); // Tokyo time

    const durationMs = arrTime - depTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    console.log(`  Departure (UTC): ${depTime.toISOString()}`);
    console.log(`  Arrival (UTC): ${arrTime.toISOString()}`);
    console.log(`  Flight duration: ${durationHours.toFixed(1)} hours`);

    // This should be a long flight (10+ hours)
    expect(durationHours).toBeGreaterThan(10);
});

test('Algorithm flight duration calculation', () => {
    // Simulate how the algorithm calculates duration
    const depDateTime = '2026-01-31T09:00';
    const arrDateTime = '2026-02-01T17:00';

    const fbStart = new Date(depDateTime);
    const fbEnd = new Date(arrDateTime);

    const durationMins = (fbEnd - fbStart) / (1000 * 60);
    const durationHours = durationMins / 60;

    console.log(`  Algorithm sees departure: ${fbStart.toISOString()}`);
    console.log(`  Algorithm sees arrival: ${fbEnd.toISOString()}`);
    console.log(`  Algorithm calculated duration: ${durationHours.toFixed(1)} hours (${durationMins} mins)`);
    console.log(`  Meets 4-hour threshold for nap: ${durationMins >= 240 ? 'YES' : 'NO'}`);

    // The issue: without timezone info in the datetime-local string,
    // JavaScript parses them as local time, making the duration wrong
});

// ============ Test: Flight Day Detection ============
console.log('\n--- Flight Day Detection ---\n');

test('Flight should appear on correct day', () => {
    const config = {
        homeTimezone: 'Pacific/Honolulu',
        usualBedtime: '21:00',
        usualWaketime: '05:00',
        daysBeforeStart: 0,
        flights: [{
            departureAirport: 'HNL',
            arrivalAirport: 'TYO',
            departureDateTime: '2026-01-31T09:00',
            departureTimezone: 'Pacific/Honolulu',
            arrivalDateTime: '2026-02-01T17:00',
            arrivalTimezone: 'Asia/Tokyo',
        }],
    };

    const plan = context.createJetLagPlan(config);

    console.log(`  Schedule days:`);
    plan.schedule.forEach(day => {
        const flightEvent = day.events.find(e => e.type === 'flight');
        const inFlightSleep = day.events.find(e => (e.type === 'nap' || e.type === 'sleep') && e.inFlight);
        const groundNap = day.events.find(e => e.type === 'nap' && !e.inFlight);
        console.log(`    ${day.date.toDateString()} (${day.dayLabel}): flight=${flightEvent ? 'yes' : 'no'}, in-flight-sleep=${inFlightSleep ? 'yes' : 'no'}, ground-nap=${groundNap ? 'yes' : 'no'}`);
    });
});

// ============ Test: User's Exact Scenario ============
console.log('\n--- User Scenario: HNL → TYO with connection ---\n');

test('Multi-flight scenario from screenshot', () => {
    const config = {
        homeTimezone: 'Pacific/Honolulu',
        usualBedtime: '21:00',
        usualWaketime: '05:00',
        daysBeforeStart: 0, // Day of departure
        flights: [
            {
                departureAirport: 'HNL',
                arrivalAirport: 'TYO',
                departureDateTime: '2026-01-31T09:00',
                departureTimezone: 'Pacific/Honolulu',
                arrivalDateTime: '2026-02-01T17:00',
                arrivalTimezone: 'Asia/Tokyo',
            },
            {
                departureAirport: 'TYO',
                arrivalAirport: 'TYO', // Short connection same city
                departureDateTime: '2026-02-01T21:00',
                departureTimezone: 'Asia/Tokyo',
                arrivalDateTime: '2026-02-01T23:00',
                arrivalTimezone: 'Asia/Tokyo',
            }
        ],
    };

    const plan = context.createJetLagPlan(config);

    console.log(`  Direction: ${plan.summary.direction}`);
    console.log(`  Time shift: ${plan.summary.totalShiftHours} hours`);
    console.log(`  Days to adjust: ${plan.summary.daysToAdjust}`);
    console.log(`  Schedule days: ${plan.schedule.length}`);

    // First day should be departure day (Jan 31)
    const firstDay = plan.schedule[0];
    expect(firstDay.date.getDate()).toBe(31);
    expect(firstDay.dayLabel).toBe('Departure Day');

    // Check first flight has in-flight sleep (nap or sleep type)
    const flightDayEvents = firstDay.events;
    const inFlightSleep = flightDayEvents.find(e => (e.type === 'nap' || e.type === 'sleep') && e.inFlight);
    console.log(`  In-flight sleep on departure day: ${inFlightSleep ? 'YES' : 'NO'}`);
    if (inFlightSleep) {
        const durationMins = inFlightSleep.endTime - inFlightSleep.startTime;
        console.log(`  Sleep duration: ${Math.floor(durationMins / 60)}h ${durationMins % 60}m`);
    }
    expect(inFlightSleep).toBeTruthy();

    // Print full schedule
    console.log(`\n  Full schedule:`);
    plan.schedule.forEach(day => {
        const events = day.events.map(e => e.type).join(', ');
        console.log(`    ${day.date.toDateString()} (${day.dayLabel}): ${events}`);
    });
});

test('TYO → HNL direction (crossing date line)', () => {
    const config = {
        homeTimezone: 'Asia/Tokyo',
        usualBedtime: '23:00',
        usualWaketime: '07:00',
        daysBeforeStart: 0,
        flights: [{
            departureAirport: 'TYO',
            arrivalAirport: 'HNL',
            departureDateTime: '2026-02-01T10:00',
            departureTimezone: 'Asia/Tokyo',
            arrivalDateTime: '2026-02-01T08:00',
            arrivalTimezone: 'Pacific/Honolulu',
        }],
    };

    const plan = context.createJetLagPlan(config);

    console.log(`  Direction: ${plan.summary.direction}`);
    console.log(`  Time shift: ${plan.summary.totalShiftHours} hours`);

    // TYO (+9) to HNL (-10) = -19 hours raw shift
    // Since |-19| > 12, we take the shorter path: -19 + 24 = +5
    // Positive shift = eastward adjustment (advance clock)
    // This is correct: when landing in HNL, body thinks it's evening but it's morning
    // Need to advance clock (eastward) to sync
    expect(plan.summary.direction).toBe('east');
    expect(plan.summary.totalShiftHours).toBe(5);
});

// ============ Summary ============
console.log('\n=== Summary ===\n');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log('');

if (testsFailed > 0) {
    process.exit(1);
}
