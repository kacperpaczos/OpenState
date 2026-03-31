import { test, expect } from '@playwright/test';

/**
 * E1: Navigation to every page (tests 61-68)
 * Verifies that all routes load with HTTP 200 and contain expected content.
 */
test.describe('E1: Global Navigation', () => {
    const pages = [
        { path: '/', expected: 'legislacyjny' },
        { path: '/ustawy', expected: 'Projekty' },
        { path: '/poslowie', expected: 'Parlamentarzyści' },
        { path: '/senatorowie', expected: '' },
        { path: '/glosowania', expected: 'Głosowań' },
        { path: '/interpelacje', expected: 'Interpelacje' },
        { path: '/rcl', expected: 'Legislacji' },
        { path: '/harmonogram', expected: '' },
    ];

    for (const { path, expected } of pages) {
        test(`${path} loads with HTTP 200`, async ({ page }) => {
            const response = await page.goto(path);
            expect(response?.status()).toBe(200);
            if (expected) {
                await expect(page.locator('body')).toContainText(expected);
            }
        });
    }
});
