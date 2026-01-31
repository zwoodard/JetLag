/**
 * JetLag Algorithm
 *
 * Scientific basis:
 * - Core Body Temperature minimum (CBTmin) occurs ~2-3 hours before natural wake time
 * - Light exposure AFTER CBTmin advances circadian clock (for eastward travel)
 * - Light exposure BEFORE CBTmin delays circadian clock (for westward travel)
 * - Body can shift ~1-1.5 hours per day naturally
 * - Melatonin 5h before bed advances clock; upon waking delays clock
 * - Caffeine should be avoided 6+ hours before desired sleep
 */

class JetLagPlanner {
    constructor(config) {
        this.homeTimezone = config.homeTimezone;
        this.homeOffset = getTimezoneOffset(config.homeTimezone);
        this.usualBedtime = this.parseTime(config.usualBedtime); // minutes from midnight
        this.usualWaketime = this.parseTime(config.usualWaketime);
        this.flights = config.flights;
        this.daysBeforeStart = config.daysBeforeStart || 2;

        // Constants
        this.MAX_SHIFT_PER_DAY = 1.5; // hours
        this.SLEEP_DURATION = this.calculateSleepDuration();
        this.CBMT_BEFORE_WAKE = 2.5; // hours before wake time
        this.LIGHT_EXPOSURE_DURATION = 2; // hours
        this.CAFFEINE_CUTOFF_BEFORE_BED = 6; // hours
        this.MELATONIN_BEFORE_BED = 5; // hours (for advancing)
    }

    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    formatTime(minutes) {
        const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
        const hours = Math.floor(normalizedMinutes / 60);
        const mins = Math.round(normalizedMinutes % 60);
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    calculateSleepDuration() {
        let duration = this.usualWaketime - this.usualBedtime;
        if (duration < 0) duration += 1440; // Handle overnight sleep
        return duration;
    }

    generatePlan() {
        if (this.flights.length === 0) {
            return { error: 'No flights provided' };
        }

        // Sort flights by departure time
        const sortedFlights = [...this.flights].sort((a, b) =>
            new Date(a.departureDateTime) - new Date(b.departureDateTime)
        );

        const firstFlight = sortedFlights[0];
        const lastFlight = sortedFlights[sortedFlights.length - 1];

        // Calculate total timezone shift
        const departureOffset = getTimezoneOffset(firstFlight.departureTimezone);
        const arrivalOffset = getTimezoneOffset(lastFlight.arrivalTimezone);
        const totalShift = arrivalOffset - departureOffset; // positive = eastward

        // Determine direction and optimal approach
        let effectiveShift = totalShift;
        let direction = 'east';

        // If shift > 12 hours, it may be easier to go the other way
        if (Math.abs(totalShift) > 12) {
            effectiveShift = totalShift > 0 ? totalShift - 24 : totalShift + 24;
        }

        if (effectiveShift < 0) {
            direction = 'west';
            effectiveShift = Math.abs(effectiveShift);
        }

        // Calculate number of days needed for adjustment
        const daysToAdjust = Math.ceil(effectiveShift / this.MAX_SHIFT_PER_DAY);

        // Generate schedule
        const schedule = this.buildSchedule({
            flights: sortedFlights,
            direction,
            totalShift: effectiveShift,
            daysToAdjust,
            departureOffset,
            arrivalOffset,
            firstDepartureDate: new Date(firstFlight.departureDateTime),
            lastArrivalDate: new Date(lastFlight.arrivalDateTime),
        });

        return {
            summary: {
                direction,
                totalShiftHours: effectiveShift,
                daysToAdjust,
                departureTimezone: firstFlight.departureTimezone,
                arrivalTimezone: lastFlight.arrivalTimezone,
                firstDepartureDate: firstFlight.departureDateTime,
                lastArrivalDate: lastFlight.arrivalDateTime,
            },
            schedule,
        };
    }

    buildSchedule(params) {
        const {
            flights,
            direction,
            totalShift,
            daysToAdjust,
            departureOffset,
            arrivalOffset,
            firstDepartureDate,
            lastArrivalDate,
        } = params;

        const schedule = [];

        // Start date: N days before first flight
        const startDate = new Date(firstDepartureDate);
        startDate.setDate(startDate.getDate() - this.daysBeforeStart);
        startDate.setHours(0, 0, 0, 0);

        // End date: N days after last arrival
        const endDate = new Date(lastArrivalDate);
        endDate.setDate(endDate.getDate() + Math.max(daysToAdjust - this.daysBeforeStart, 2));
        endDate.setHours(23, 59, 59, 999);

        // Calculate daily shift amount
        const shiftPerDay = totalShift / (this.daysBeforeStart + daysToAdjust);

        // Track current circadian phase (in home timezone initially)
        let currentBedtime = this.usualBedtime;
        let currentWaketime = this.usualWaketime;
        let currentOffset = departureOffset;
        let dayIndex = 0;

        // Determine which phase we're in
        const getPhase = (date) => {
            if (date < firstDepartureDate) return 'pre-flight';
            if (date > lastArrivalDate) return 'post-arrival';
            return 'in-transit';
        };

        // Create flight lookup for blocking times
        const flightBlocks = flights.map(f => ({
            start: new Date(f.departureDateTime),
            end: new Date(f.arrivalDateTime),
            flight: f,
        }));

        // Check if a time range conflicts with any flight
        const conflictsWithFlight = (start, end) => {
            return flightBlocks.some(fb => {
                return (start < fb.end && end > fb.start);
            });
        };

        // Iterate through each day
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const phase = getPhase(currentDate);
            const dayOfTrip = dayIndex - this.daysBeforeStart;
            const events = [];

            // Calculate target times for this day
            let shiftApplied = 0;
            if (phase === 'pre-flight') {
                // Gradually shift before departure
                shiftApplied = (dayIndex + 1) * shiftPerDay;
            } else if (phase === 'post-arrival') {
                // Continue shifting toward destination
                const daysSinceArrival = Math.floor((currentDate - lastArrivalDate) / (1000 * 60 * 60 * 24));
                shiftApplied = Math.min(totalShift, (this.daysBeforeStart + daysSinceArrival + 1) * shiftPerDay);
            } else {
                // During transit, maintain current shift
                shiftApplied = (this.daysBeforeStart) * shiftPerDay;
            }

            // Apply shift (eastward = earlier times, westward = later times)
            const shiftMinutes = (direction === 'east' ? -1 : 1) * shiftApplied * 60;
            const targetBedtime = this.usualBedtime + shiftMinutes;
            const targetWaketime = this.usualWaketime + shiftMinutes;

            // Calculate CBTmin (2-3 hours before wake time)
            const cbtMin = targetWaketime - (this.CBMT_BEFORE_WAKE * 60);

            // Add flight events for this day
            flightBlocks.forEach(fb => {
                const flightDate = new Date(fb.start);
                if (flightDate.toDateString() === currentDate.toDateString()) {
                    const flightStartMins = fb.start.getHours() * 60 + fb.start.getMinutes();
                    const flightEndMins = fb.end.getHours() * 60 + fb.end.getMinutes();
                    const flightDurationMins = (fb.end - fb.start) / (1000 * 60);

                    events.push({
                        type: 'flight',
                        startTime: flightStartMins,
                        endTime: flightEndMins,
                        description: `Flight: ${fb.flight.departureAirport || 'Departure'} → ${fb.flight.arrivalAirport || 'Arrival'}`,
                        flight: fb.flight,
                    });

                    // Add in-flight nap for longer flights (4+ hours)
                    if (flightDurationMins >= 240) {
                        // Nap about 1-2 hours into the flight, for 20-90 mins depending on flight length
                        const napStartOffset = 60; // 1 hour after takeoff
                        const napDuration = Math.min(90, Math.floor(flightDurationMins / 4)); // Up to 90 mins
                        const napStartMins = flightStartMins + napStartOffset;
                        const napEndMins = napStartMins + napDuration;

                        // Only add if nap fits within flight
                        if (napEndMins < flightEndMins - 30) {
                            events.push({
                                type: 'nap',
                                startTime: napStartMins,
                                endTime: napEndMins,
                                description: `In-flight nap (${napDuration} mins) - helps adjust to destination time`,
                                inFlight: true,
                            });
                        }
                    }
                }
            });

            // Sleep event
            events.push({
                type: 'sleep',
                startTime: targetBedtime,
                endTime: targetWaketime,
                description: 'Sleep',
            });

            // Light exposure recommendations
            if (direction === 'east') {
                // Seek light after CBTmin (morning) to advance clock
                const lightSeekStart = Math.max(targetWaketime, cbtMin);
                const lightSeekEnd = lightSeekStart + this.LIGHT_EXPOSURE_DURATION * 60;
                events.push({
                    type: 'light-seek',
                    startTime: lightSeekStart,
                    endTime: lightSeekEnd,
                    description: 'Seek bright light (sunlight or light box)',
                });

                // Avoid light before CBTmin (evening before bed)
                const lightAvoidStart = targetBedtime - 3 * 60;
                const lightAvoidEnd = targetBedtime;
                events.push({
                    type: 'light-avoid',
                    startTime: lightAvoidStart,
                    endTime: lightAvoidEnd,
                    description: 'Avoid bright light, use dim lighting or blue blockers',
                });

                // Melatonin to advance clock (5h before target bedtime)
                const melatoninTime = targetBedtime - this.MELATONIN_BEFORE_BED * 60;
                if (melatoninTime > targetWaketime) {
                    events.push({
                        type: 'melatonin',
                        startTime: melatoninTime,
                        endTime: melatoninTime + 30,
                        description: 'Take melatonin (0.5-3mg) to help advance sleep',
                    });
                }
            } else {
                // Westward: delay the clock
                // Seek light before CBTmin (evening) to delay clock
                const lightSeekStart = targetBedtime - 4 * 60;
                const lightSeekEnd = lightSeekStart + this.LIGHT_EXPOSURE_DURATION * 60;
                if (lightSeekEnd < targetBedtime) {
                    events.push({
                        type: 'light-seek',
                        startTime: lightSeekStart,
                        endTime: lightSeekEnd,
                        description: 'Seek bright light to delay sleep',
                    });
                }

                // Avoid light after waking for first few hours
                const lightAvoidEnd = targetWaketime + 2 * 60;
                events.push({
                    type: 'light-avoid',
                    startTime: targetWaketime,
                    endTime: lightAvoidEnd,
                    description: 'Avoid bright morning light, wear sunglasses if needed',
                });

                // Melatonin upon waking can help delay (optional, less common)
                // Skip for simplicity in westward travel
            }

            // Caffeine windows
            const caffeineStart = targetWaketime;
            const caffeineEnd = targetBedtime - this.CAFFEINE_CUTOFF_BEFORE_BED * 60;
            if (caffeineEnd > caffeineStart) {
                events.push({
                    type: 'caffeine',
                    startTime: caffeineStart,
                    endTime: caffeineEnd,
                    description: 'Caffeine OK (coffee, tea). Stop after this window.',
                });
            }

            // Optional strategic nap (if needed and not during flight)
            if (phase === 'post-arrival' || phase === 'in-transit') {
                // Short nap in early afternoon if needed
                const napTime = targetWaketime + 6 * 60; // 6 hours after wake
                const napEnd = napTime + 20; // 20-minute power nap

                // Check if this conflicts with flights
                const napStartDate = new Date(currentDate);
                napStartDate.setHours(Math.floor(napTime / 60), napTime % 60);
                const napEndDate = new Date(currentDate);
                napEndDate.setHours(Math.floor(napEnd / 60), napEnd % 60);

                if (!conflictsWithFlight(napStartDate, napEndDate) && napTime > 0 && napTime < targetBedtime - 4 * 60) {
                    events.push({
                        type: 'nap',
                        startTime: napTime,
                        endTime: napEnd,
                        description: 'Optional 20-min power nap if drowsy (set alarm!)',
                    });
                }
            }

            // Filter out events that conflict with flights (except the flight itself)
            const filteredEvents = events.filter(event => {
                if (event.type === 'flight') return true;

                // Check if event time conflicts with any flight
                const eventStart = new Date(currentDate);
                const startMins = ((event.startTime % 1440) + 1440) % 1440;
                eventStart.setHours(Math.floor(startMins / 60), startMins % 60);

                const eventEnd = new Date(currentDate);
                const endMins = ((event.endTime % 1440) + 1440) % 1440;
                eventEnd.setHours(Math.floor(endMins / 60), endMins % 60);

                // Handle overnight events
                if (endMins < startMins) {
                    eventEnd.setDate(eventEnd.getDate() + 1);
                }

                return !conflictsWithFlight(eventStart, eventEnd);
            });

            schedule.push({
                date: new Date(currentDate),
                dayIndex,
                dayLabel: this.getDayLabel(dayIndex, this.daysBeforeStart, phase, lastArrivalDate, currentDate),
                phase,
                events: filteredEvents.sort((a, b) => {
                    const aStart = ((a.startTime % 1440) + 1440) % 1440;
                    const bStart = ((b.startTime % 1440) + 1440) % 1440;
                    return aStart - bStart;
                }),
                targetBedtime,
                targetWaketime,
            });

            currentDate.setDate(currentDate.getDate() + 1);
            dayIndex++;
        }

        return schedule;
    }

    getDayLabel(dayIndex, daysBeforeStart, phase, lastArrivalDate, currentDate) {
        if (phase === 'pre-flight') {
            const daysUntil = daysBeforeStart - dayIndex;
            if (daysUntil === 0) return 'Departure Day';
            return `${daysUntil} day${daysUntil > 1 ? 's' : ''} before departure`;
        } else if (phase === 'in-transit') {
            return 'Travel Day';
        } else {
            const daysSince = Math.floor((currentDate - lastArrivalDate) / (1000 * 60 * 60 * 24));
            if (daysSince === 0) return 'Arrival Day';
            return `Day ${daysSince} at destination`;
        }
    }
}

// Utility function to create planner and generate plan
function createJetLagPlan(config) {
    const planner = new JetLagPlanner(config);
    return planner.generatePlan();
}
