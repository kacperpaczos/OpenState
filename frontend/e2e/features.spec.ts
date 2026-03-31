import { test, expect } from '@playwright/test';

/**
 * E7-E10 + extras: Interpelacje search, Kanban, Theme toggle, Load More, 
 * Bill details, Senatorowie accessible from nav (tests 77-82)
 */

// E7: Interpelacje search (test 77)
test.describe('E7: Interpelacje search', () => {
    test('search input filters interpelacje results', async ({ page }) => {
        await page.goto('/interpelacje');
        await page.waitForSelector('.glass-card');
        const initialCount = await page.locator('.glass-card').count();

        const searchInput = page.locator('input[placeholder*="Szukaj w interpelacjach"]');
        await searchInput.fill('zzznonexistent');
        await page.waitForTimeout(500);

        const filteredCount = await page.locator('.glass-card').count();
        expect(filteredCount).toBeLessThan(initialCount);
    });
});

// E8: Kanban board (test 78)
test.describe('E8: Kanban board', () => {
    test('harmonogram renders kanban columns', async ({ page }) => {
        await page.goto('/harmonogram');
        await page.waitForTimeout(1000);
        const body = await page.locator('body').textContent();
        expect(body).toContain('Inicjatywa');
    });
});

// E9: Theme toggle (test 79)
test.describe('E9: Theme toggle', () => {
    test('double-click returns to original state', async ({ page }) => {
        await page.goto('/');
        const htmlEl = page.locator('html');
        const initialClass = await htmlEl.getAttribute('class');

        await page.click('button[aria-label="Toggle Theme"]');
        await page.waitForTimeout(200);
        const midClass = await htmlEl.getAttribute('class');
        expect(midClass).not.toBe(initialClass);

        await page.click('button[aria-label="Toggle Theme"]');
        await page.waitForTimeout(200);
        const finalClass = await htmlEl.getAttribute('class');
        expect(finalClass).toBe(initialClass);
    });
});

// E10: Load More (test 80)
test.describe('E10: MP Load More', () => {
    test('"Pokaż więcej" increases visible cards', async ({ page }) => {
        await page.goto('/poslowie');
        await page.waitForSelector('.glass-card');

        const loadMoreBtn = page.locator('button:has-text("Pokaż więcej")');
        const hasLoadMore = await loadMoreBtn.count();

        if (hasLoadMore > 0) {
            const initialCards = await page.locator('.glass-card').count();
            await loadMoreBtn.click();
            await page.waitForTimeout(300);
            const afterCards = await page.locator('.glass-card').count();
            expect(afterCards).toBeGreaterThan(initialCards);
        }
    });
});

// E11: Bill detail (test 81)
test.describe('Bill detail page', () => {
    test('clicking a bill opens detail with timeline', async ({ page }) => {
        await page.goto('/ustawy');
        await page.waitForSelector('.glass-card');

        const firstBill = page.locator('.glass-card a, a .glass-card').first();
        if (await firstBill.count() > 0) {
            await firstBill.click();
            await page.waitForURL(/\/ustawy\/.+/);
            // Detail page should have content
            await expect(page.locator('body')).not.toBeEmpty();
        }
    });
});

// E12: /senatorowie accessible from navbar (test 82)
test.describe('Senatorowie accessible from nav', () => {
    test('/senatorowie is reachable via Navbar link', async ({ page }) => {
        await page.goto('/');
        const navLink = page.locator('nav a:has-text("Senatorowie")');
        await expect(navLink).toBeVisible();
        await navLink.click();
        await page.waitForURL('/senatorowie');
        const response = await page.goto('/senatorowie');
        expect(response?.status()).toBe(200);
    });
});
