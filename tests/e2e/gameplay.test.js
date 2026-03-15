// Tests for: specs/E2E-GAMEPLAY.md
// Requires the Vite dev server running at http://localhost:5173
// Run with: npm run test:e2e

import { test, expect } from '@playwright/test';

// Helper: read the active scene key from the Phaser game instance
async function getActiveScene(page) {
    return page.evaluate(() => {
        const scenes = window.__game?.scene?.scenes ?? [];
        const active = scenes.find(s => s.scene?.isActive());
        return active?.scene?.key ?? null;
    });
}

// Helper: read the current ball state constructor name
async function getBallStateName(page) {
    return page.evaluate(() => {
        const scene = window.__game?.scene?.getScene('Level1Scene');
        return scene?.ball?.currentState?.constructor?.name ?? null;
    });
}

// Helper: wait for Level1 to be fully loaded (ball exists in scene)
async function waitForLevel1(page) {
    await page.waitForFunction(
        () => {
            const scene = window.__game?.scene?.getScene('Level1Scene');
            return scene?.scene?.isActive() && scene?.ball != null;
        },
        { timeout: 10_000 }
    );
}

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for Phaser to initialise and __game to be available
    await page.waitForFunction(() => window.__game != null, { timeout: 10_000 });
});

// E2E-01
test('E2E-01: game loads and menu is visible', async ({ page }) => {
    // The canvas should be present
    await expect(page.locator('canvas')).toBeVisible();
    // MenuScene should be the active scene
    const scene = await getActiveScene(page);
    expect(scene).toBe('MenuScene');
});

// E2E-02
test('E2E-02: pressing Enter starts Level1', async ({ page }) => {
    await page.keyboard.press('Enter');
    await waitForLevel1(page);
    const scene = await getActiveScene(page);
    expect(scene).toBe('Level1Scene');
});

// E2E-03
test('E2E-03: ball starts in BouncyBallState', async ({ page }) => {
    await page.keyboard.press('Enter');
    await waitForLevel1(page);
    const stateName = await getBallStateName(page);
    expect(stateName).toBe('BouncyBallState');
});

// E2E-04
test('E2E-04: pressing 3 transitions to StickyBallState', async ({ page }) => {
    await page.keyboard.press('Enter');
    await waitForLevel1(page);
    await page.keyboard.press('Digit3');
    const stateName = await getBallStateName(page);
    expect(stateName).toBe('StickyBallState');
});

// E2E-05
test('E2E-05: pressing 2 transitions to MetalBallState', async ({ page }) => {
    await page.keyboard.press('Enter');
    await waitForLevel1(page);
    await page.keyboard.press('Digit2');
    const stateName = await getBallStateName(page);
    expect(stateName).toBe('MetalBallState');
});

// E2E-06
test('E2E-06: pressing 1 transitions back to BouncyBallState', async ({ page }) => {
    await page.keyboard.press('Enter');
    await waitForLevel1(page);
    await page.keyboard.press('Digit2');
    await page.keyboard.press('Digit1');
    const stateName = await getBallStateName(page);
    expect(stateName).toBe('BouncyBallState');
});

// E2E-07
test('E2E-07: pressing ESC in Level1 returns to MenuScene', async ({ page }) => {
    await page.keyboard.press('Enter');
    await waitForLevel1(page);
    await page.keyboard.press('Escape');
    await page.waitForFunction(
        () => {
            const scene = window.__game?.scene?.getScene('MenuScene');
            return scene?.scene?.isActive();
        },
        { timeout: 5_000 }
    );
    const scene = await getActiveScene(page);
    expect(scene).toBe('MenuScene');
});

// E2E-08
test('E2E-08: switching away from StickyBallState while on a wall causes ball to drop', async ({ page }) => {
    await page.keyboard.press('Enter');
    await waitForLevel1(page);

    // Switch to sticky and hold left to reach the left wall
    await page.keyboard.press('Digit3');
    await page.keyboard.down('ArrowLeft');

    // Wait until the ball is touching the left wall
    await page.waitForFunction(
        () => {
            const scene = window.__game?.scene?.getScene('Level1Scene');
            const body = scene?.ball?.body;
            return body?.blocked?.left || body?.touching?.left;
        },
        { timeout: 8_000 }
    );
    await page.keyboard.up('ArrowLeft');

    // Record Y position while stuck to wall
    const yBefore = await page.evaluate(() => {
        return window.__game.scene.getScene('Level1Scene').ball.y;
    });

    // Switch away from sticky — gravity resumes, ball should fall
    await page.keyboard.press('Digit1');

    // Wait a couple of frames for physics to advance
    await page.waitForTimeout(200);

    const yAfter = await page.evaluate(() => {
        return window.__game.scene.getScene('Level1Scene').ball.y;
    });

    // Y increases downward in Phaser's coordinate system
    expect(yAfter).toBeGreaterThan(yBefore);
});
