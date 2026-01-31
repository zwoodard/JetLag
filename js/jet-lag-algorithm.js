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
        this.daysBeforeStart = config.daysBeforeStart !== undefined ? config.daysBeforeStart : 2;

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

    /**
     * Calculate true flight duration by converting local times to UTC.
     *
     * The datetime-local input gives us "wall clock" time at departure/arrival,
     * but without timezone info. We need to convert both to UTC to get the
     * actual elapsed time.
     *
     * Example: HNL 9:00 AM (UTC-10) to TYO 5:00 PM next day (UTC+9)
     *   - Departure UTC: 9:00 + 10 = 19:00 on Jan 31
     *   - Arrival UTC: 17:00 - 9 = 08:00 on Feb 1
     *   - Duration: 13 hours (not 32 hours!)
     */
    calculateFlightDuration(flight) {
        const depOffset = getTimezoneOffset(flight.departureTimezone);
        const arrOffset = getTimezoneOffset(flight.arrivalTimezone);

        if (depOffset === null || arrOffset === null) {
            // Fallback to naive calculation if timezones unknown
            const start = new Date(flight.departureDateTime);
            const end = new Date(flight.arrivalDateTime);
            return (end - start) / (1000 * 60);
        }

        // Parse the local times
        const depLocal = new Date(flight.departureDateTime);
        const arrLocal = new Date(flight.arrivalDateTime);

        // Convert to UTC by subtracting the timezone offset
        // (offset is in hours, positive = east of UTC)
        const depUTC = depLocal.getTime() - (depOffset * 60 * 60 * 1000);
        const arrUTC = arrLocal.getTime() - (arrOffset * 60 * 60 * 1000);

        // Duration in minutes
        const durationMins = (arrUTC - depUTC) / (1000 * 60);

        return Math.max(0, durationMins);
    }

    /**
     * Calculate optimal in-flight sleep based on flight duration, arrival time, and direction.
     *
     * Scientific rationale:
     * - Short flights (4-6h): 90-min nap (one sleep cycle) to avoid deep sleep inertia
     * - Medium flights (6-10h): 2-3 hours of sleep, especially if arriving in morning
     * - Long flights (10-14h): 3-4 hours of sleep, timed to align with destination night
     * - Ultra-long flights (14h+): Up to 5-6 hours, essentially a full sleep period
     *
     * Arrival time considerations:
     * - Morning arrival: Sleep more on plane (you'll need to stay awake all day)
     * - Evening arrival: Sleep less on plane (you can sleep soon after landing)
     *
     * Direction considerations:
     * - Eastward: Pre-arrival sleep is more critical (you're losing hours)
     * - Westward: Can get away with less sleep (you're gaining hours)
     */
    calculateInFlightSleep(params) {
        const { flightDurationMins, arrivalTime, direction, arrivalOffset, departureOffset } = params;

        // Get arrival hour in local destination time
        const arrivalHour = arrivalTime.getHours();

        // Determine if arriving in morning (need to stay awake) vs evening (can sleep soon)
        const isMorningArrival = arrivalHour >= 5 && arrivalHour <= 14;
        const isEveningArrival = arrivalHour >= 18 || arrivalHour <= 4;

        // Base sleep duration on flight length
        let baseDuration;
        let startOffset = 60; // Default: start 1 hour after takeoff

        if (flightDurationMins < 360) {
            // 4-6 hours: single sleep cycle
            baseDuration = 90;
        } else if (flightDurationMins < 600) {
            // 6-10 hours: 2-3 hours
            baseDuration = 150;
            startOffset = 90; // Start a bit later
        } else if (flightDurationMins < 840) {
            // 10-14 hours: 3-4 hours
            baseDuration = 210;
            startOffset = 120;
        } else {
            // 14+ hours: 4-5 hours (can do more if needed)
            baseDuration = 270;
            startOffset = 120;
        }

        // Adjust for arrival time
        if (isMorningArrival) {
            // Arriving in morning = need to stay awake all day
            // Sleep MORE on the plane (add 30-60 mins)
            baseDuration = Math.min(baseDuration + 60, flightDurationMins - startOffset - 60);
        } else if (isEveningArrival) {
            // Arriving in evening = can sleep soon after landing
            // Sleep LESS on the plane to build sleep pressure
            baseDuration = Math.max(90, baseDuration - 30);
        }

        // Adjust for direction
        if (direction === 'east') {
            // Eastward travel: more important to arrive rested
            // Slight increase (but already factored into morning arrival logic)
            baseDuration = Math.min(baseDuration + 15, flightDurationMins - startOffset - 60);
        }

        // Ensure we don't exceed what fits in the flight
        const maxSleepDuration = flightDurationMins - startOffset - 45; // 45 min buffer before landing
        const finalDuration = Math.min(baseDuration, maxSleepDuration);

        // Build description
        let description;
        const hours = Math.floor(finalDuration / 60);
        const mins = finalDuration % 60;
        const timeStr = hours > 0
            ? (mins > 0 ? `${hours}h ${mins}m` : `${hours}h`)
            : `${mins} mins`;

        if (finalDuration >= 180) {
            description = `In-flight sleep (${timeStr}) - ${isMorningArrival ? 'rest up before a full day ahead' : 'helps shift to destination time'}`;
        } else if (finalDuration >= 120) {
            description = `In-flight rest (${timeStr}) - ${isMorningArrival ? 'banking sleep for morning arrival' : 'helps adjust to destination time'}`;
        } else {
            description = `In-flight nap (${timeStr}) - one sleep cycle to refresh`;
        }

        return {
            duration: Math.max(0, Math.round(finalDuration)),
            startOffset,
            description,
        };
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
        // Include pre-calculated duration using proper timezone conversion
        const flightBlocks = flights.map(f => ({
            start: new Date(f.departureDateTime),
            end: new Date(f.arrivalDateTime),
            flight: f,
            durationMins: this.calculateFlightDuration(f),
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
                    // Use pre-calculated duration with proper timezone handling
                    const flightDurationMins = fb.durationMins;

                    events.push({
                        type: 'flight',
                        startTime: flightStartMins,
                        endTime: flightEndMins,
                        description: `Flight: ${fb.flight.departureAirport || 'Departure'} → ${fb.flight.arrivalAirport || 'Arrival'}`,
                        flight: fb.flight,
                    });

                    // Add in-flight sleep for longer flights (4+ hours)
                    // Sleep duration is based on flight length, arrival time, and direction
                    if (flightDurationMins >= 240) {
                        const sleepParams = this.calculateInFlightSleep({
                            flightDurationMins,
                            arrivalTime: fb.end,
                            direction,
                            arrivalOffset,
                            departureOffset,
                        });

                        if (sleepParams.duration > 0) {
                            const sleepStartMins = flightStartMins + sleepParams.startOffset;
                            const sleepEndMins = sleepStartMins + sleepParams.duration;

                            // Verify sleep fits within flight
                            const sleepEndsBeforeLanding = (sleepParams.startOffset + sleepParams.duration + 30) < flightDurationMins;

                            if (sleepEndsBeforeLanding) {
                                const isLongSleep = sleepParams.duration >= 120;
                                events.push({
                                    type: isLongSleep ? 'sleep' : 'nap',
                                    startTime: sleepStartMins,
                                    endTime: sleepEndMins,
                                    description: sleepParams.description,
                                    inFlight: true,
                                });
                            }
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

            // Filter out events that conflict with flights (except flights and in-flight activities)
            const filteredEvents = events.filter(event => {
                if (event.type === 'flight') return true;
                if (event.inFlight) return true; // Keep in-flight naps

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
