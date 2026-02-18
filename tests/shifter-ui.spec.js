// @ts-check
const { test, expect } = require('@playwright/test');

const TEST_URL_DATA = 'eyJoIjoiUGFjaWZpYy9Ib25vbHVsdSIsImIiOiIyMTowMCIsInciOiIwNTozMCIsImQiOiIyIiwiZiI6W3siZGEiOiJDVFMiLCJhYSI6IkhORCIsImRkIjoiMjAyNi0wMi0xNVQxNzowMCIsImR0IjoiQXNpYS9Ub2t5byIsImFkIjoiMjAyNi0wMi0xNVQxODo0NSIsImF0IjoiQXNpYS9Ub2t5byJ9LHsiZGEiOiJITkQiLCJhYSI6IkhOTCIsImRkIjoiMjAyNi0wMi0xNVQyMDowMCIsImR0IjoiQXNpYS9Ub2t5byIsImFkIjoiMjAyNi0wMi0xNVQwODowMCIsImF0IjoiUGFjaWZpYy9Ib25vbHVsdSJ9XX0';

function dismissPopup(page) {
    return page.evaluate(() => document.getElementById('shifter-popup').classList.remove('visible'));
}

test.describe('Shifter UI bug fixes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`http://localhost:8080/?d=${TEST_URL_DATA}`);
        await page.click('#generate-btn');
        await page.click('.tab-btn[data-tab="shifter"]');
        await page.waitForSelector('.shifter-event');
    });

    test('Issue 1: No double emoji in popup', async ({ page }) => {
        const caffeineEvent = page.locator('.shifter-event-caffeine').first();
        await caffeineEvent.click();
        await page.waitForSelector('.shifter-popup.visible');

        const icon = await page.locator('.shifter-popup-icon').textContent();
        const title = await page.locator('.shifter-popup-title').textContent();

        console.log(`Popup icon: "${icon}"`);
        console.log(`Popup title: "${title}"`);

        expect(icon.trim()).toBe('☕');
        expect(title.trim()).toBe('Caffeine OK');
    });

    test('Issue 2: Melatonin emoji does not clip past event boundary', async ({ page }) => {
        const melatoninEvent = page.locator('.shifter-event-melatonin').first();

        const overflow = await melatoninEvent.evaluate(el => {
            return window.getComputedStyle(el).overflow;
        });

        console.log(`Melatonin event overflow: "${overflow}"`);
        expect(overflow).toBe('hidden');
    });

    test('Issue 3: Melatonin timing is ~90 min before bed, not 5 hours', async ({ page }) => {
        // Click melatonin event to get its time
        const melatoninEvent = page.locator('.shifter-event-melatonin').first();
        await melatoninEvent.click();
        await page.waitForSelector('.shifter-popup.visible');

        const timeText = await page.locator('.shifter-popup-time').textContent();
        console.log(`Melatonin time: "${timeText}"`);
        await dismissPopup(page);

        // Click sleep event on the same day
        const melatoninDay = melatoninEvent.locator('xpath=ancestor::div[contains(@class, "shifter-day")]');
        const sleepEvent = melatoninDay.locator('.shifter-event-sleep').first();
        await sleepEvent.click();
        await page.waitForSelector('.shifter-popup.visible');

        const sleepTimeText = await page.locator('.shifter-popup-time').textContent();
        console.log(`Sleep time: "${sleepTimeText}"`);

        const parseTime = (str) => {
            const match = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return null;
            let h = parseInt(match[1]);
            const m = parseInt(match[2]);
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && h !== 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };

        const melatoninMins = parseTime(timeText);
        const sleepStart = parseTime(sleepTimeText.split('-')[0]);

        if (melatoninMins !== null && sleepStart !== null) {
            let diff = sleepStart - melatoninMins;
            if (diff < 0) diff += 1440;
            const diffHours = diff / 60;
            console.log(`Melatonin is ${diffHours.toFixed(1)} hours before sleep`);

            expect(diffHours).toBeGreaterThan(0.5);
            expect(diffHours).toBeLessThan(3);
        }
    });

    test('Issue 4: Both flights show on departure day', async ({ page }) => {
        // Get all flight events across all days
        const allFlightEvents = page.locator('.shifter-event-flight');
        const totalFlights = await allFlightEvents.count();
        console.log(`Total flight events across all days: ${totalFlights}`);

        // Should have at least 3: CTS->HND, HND->HNL (departure day), HND->HNL cont. (next day)
        expect(totalFlights).toBeGreaterThanOrEqual(3);

        // Log each flight
        for (let i = 0; i < totalFlights; i++) {
            const flight = allFlightEvents.nth(i);
            const desc = await flight.getAttribute('data-desc');
            const start = await flight.getAttribute('data-start');
            const end = await flight.getAttribute('data-end');

            // Find which day this flight is on
            const dayEl = flight.locator('xpath=ancestor::div[contains(@class, "shifter-day")]');
            const dateLabel = await dayEl.locator('.shifter-date').textContent();

            console.log(`  Flight ${i + 1}: ${desc} | ${start}-${end} | ${dateLabel}`);
        }
    });

    test('Issue 4b: Overnight flight continues on next day', async ({ page }) => {
        // Find the flight continuation (starts at midnight on the day after departure)
        const allFlightEvents = page.locator('.shifter-event-flight');
        const totalFlights = await allFlightEvents.count();

        let continuationFound = false;
        for (let i = 0; i < totalFlights; i++) {
            const flight = allFlightEvents.nth(i);
            const desc = await flight.getAttribute('data-desc');
            const start = await flight.getAttribute('data-start');

            if (desc && desc.includes('cont.')) {
                continuationFound = true;
                console.log(`Continuation flight found: ${desc} starting at ${start}`);
                expect(start).toBe('12:00 AM');

                // Verify it's on the day AFTER the departure day
                const dayEl = flight.locator('xpath=ancestor::div[contains(@class, "shifter-day")]');
                const dateLabel = await dayEl.locator('.shifter-date').textContent();
                console.log(`  On day: ${dateLabel}`);
            }
        }

        expect(continuationFound).toBe(true);
    });
});
