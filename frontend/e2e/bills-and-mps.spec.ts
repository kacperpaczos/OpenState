import { test, expect } from '@playwright/test';

/**
 * E4-E6: Bills search, MP detail, Senator detail (tests 74-76)
 */

// E4: Bills search (test 74)
test.describe('E4: Bills search', () => {
    test('Navbar search filters bills list', async ({ page }) => {
        await page.goto('/ustawy');
        await page.waitForSelector('.glass-card');
        const initialCount = await page.locator('.glass-card').count();

        const searchInput = page.locator('nav input[placeholder="Szukaj..."]');
        await searchInput.fill('zzznonexistent');
        await page.waitForTimeout(500);

        const filteredCount = await page.locator('.glass-card').count();
        expect(filteredCount).toBeLessThan(initialCount);
    });
});

// E5: MP detail (test 75)
test.describe('E5: MP detail page', () => {
    test('clicking an MP card opens their detail page with name', async ({ page }) => {
        await page.goto('/poslowie');
        await page.waitForSelector('.glass-card');

        const firstCard = page.locator('.glass-card').first();
        const name = await firstCard.locator('h3').textContent();
        await firstCard.click();
        await page.waitForURL(/\/(poslowie|senatorowie)\/.+/);

        if (name) {
            await expect(page.locator('h1')).toContainText(name);
        }
    });
});

// E6: Senator detail via filter (test 76)
test.describe('E6: Senator detail', () => {
    test('Senat filter then click opens senator detail', async ({ page }) => {
        await page.goto('/poslowie');
        await page.waitForSelector('.glass-card');

        await page.click('button:has-text("Senat")');
        await page.waitForTimeout(300);

        const firstCard = page.locator('.glass-card').first();
        await firstCard.click();
        await page.waitForURL(/\/senatorowie\/.+/);

        await expect(page.locator('body')).toContainText('Senator RP');
    });
});
