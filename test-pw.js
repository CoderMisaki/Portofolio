const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/index.html');
  await page.screenshot({ path: 'test-index.png', fullPage: true });
  await browser.close();
})();
