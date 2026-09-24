const puppeteer = require("puppeteer");

let browserInstance = null;

/**
 * Initialize Chromium / Puppeteer browser instance
 */
async function initBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("✅ Chromium started");
  }
  return browserInstance;
}

/**
 * Get current running browser instance
 */
function getBrowser() {
  if (!browserInstance) {
    throw new Error("Chromium browser has not been initialized. Call initBrowser() first.");
  }
  return browserInstance;
}

/**
 * Close browser instance gracefully
 */
async function closeBrowser() {
  if (browserInstance) {
    try {
      await browserInstance.close();
      console.log("🛑 Chromium closed gracefully");
    } catch (err) {
      console.error("❌ Error while closing Chromium:", err);
    } finally {
      browserInstance = null;
    }
  }
}

module.exports = {
  initBrowser,
  getBrowser,
  closeBrowser,
};
