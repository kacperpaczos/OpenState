import { test, expect } from '@playwright/test';

// E3: Light mode contrast — text must NOT be white on white background
test.describe('E3: Light mode text contrast', () => {
    const pagesToCheck = ['/glosowania', '/interpelacje', '/rcl'];

    for (const path of pagesToCheck) {
        test(`${path} heading is readable in light mode`, async ({ page }) => {
            await page.goto(path);

            // Switch to light mode by clicking the theme toggle
            await page.click('button[aria-label="Toggle Theme"]');

            // Wait for theme switch
            await page.waitForTimeout(300);

            // Verify that <html> does NOT have class "dark"
            const htmlClass = await page.locator('html').getAttribute('class');
            expect(htmlClass).not.toContain('dark');

            // Check that the main heading is NOT colored white  
            const h1 = page.locator('h1').first();
            const color = await h1.evaluate(el => getComputedStyle(el).color);
            // rgb(255, 255, 255) would be pure white — should NOT be that
            expect(color).not.toBe('rgb(255, 255, 255)');
        });
    }
});
