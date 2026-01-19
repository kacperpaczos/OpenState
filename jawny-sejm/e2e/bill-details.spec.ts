import { test, expect } from '@playwright/test';

test('navigate to first bill details page', async ({ page }) => {
    // 1. Go to Bills list
    await page.goto('/ustawy');

    // 2. Click the first "Szczegóły" link
    // Using a robust selector: find the first link containing text "Szczegóły"
    const detailsLink = page.getByRole('link', { name: "Szczegóły" }).first();
    await detailsLink.click();

    // 3. Verify we are on a details page
    // The URL should contain /ustawy/
    await expect(page).toHaveURL(/\/ustawy\/\d+/);

    // 4. Verify content appears
    // The "Back" link is present in all views (Success, Error, Mock)
    await expect(page.getByText(/Powrót do listy/)).toBeVisible({ timeout: 15000 });
});
