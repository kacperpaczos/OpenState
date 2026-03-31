import { test, expect } from '@playwright/test';

/**
 * E2: Homepage tests (tests 69-70)
 */
test.describe('E2: Homepage', () => {
    // 69. No duplicate header
    test('renders without duplicate header', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('legislacyjny');

        // Only one "JasnaSprawa" from the Navbar, no duplicate
        const logoCount = await page.locator('text=JasnaSprawa').count();
        expect(logoCount).toBe(1);
    });

    // 70. Quick links navigate correctly
    test('quick links have correct hrefs', async ({ page }) => {
        await page.goto('/');
        const ustawyLink = page.locator('a', { hasText: 'Ostatnie ustawy' });
        await expect(ustawyLink).toHaveAttribute('href', '/ustawy');

        const glosowaniaLink = page.locator('a', { hasText: 'Wyniki głosowań' });
        await expect(glosowaniaLink).toHaveAttribute('href', '/glosowania');

        const poslowieLink = page.locator('a', { hasText: 'Znajdź posła' });
        await expect(poslowieLink).toHaveAttribute('href', '/poslowie');
    });
});

/**
 * E3: Light mode contrast (tests 71-73)
 */
test.describe('E3: Light mode text contrast', () => {
    const pagesToCheck = [
        { path: '/glosowania', name: 'glosowania' },     // 71
        { path: '/interpelacje', name: 'interpelacje' },  // 72
        { path: '/rcl', name: 'rcl' },                    // 73
    ];

    for (const { path, name } of pagesToCheck) {
        test(`${name} heading is NOT white in light mode`, async ({ page }) => {
            await page.goto(path);
            await page.click('button[aria-label="Toggle Theme"]');
            await page.waitForTimeout(300);

            const htmlClass = await page.locator('html').getAttribute('class');
            expect(htmlClass).not.toContain('dark');

            const h1 = page.locator('h1').first();
            const color = await h1.evaluate(el => getComputedStyle(el).color);
            expect(color).not.toBe('rgb(255, 255, 255)');
        });
    }
});
