export async function ScreenshotHelper(page: import('@playwright/test').Page, screenshotDir: string, testId: string, testInfo: any) {
    const screenshotPath = `${screenshotDir}/${testId}.png`;
    await page.waitForTimeout(2000);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    await testInfo.attach(`${testId}`, {
        path: screenshotPath,
        contentType: 'image/png',
    });
}
