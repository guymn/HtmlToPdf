const path = require("path");
const { getBrowser } = require("../config/puppeteer.config");
const appConfig = require("../config/app.config");

class PdfService {
  /**
   * Convert an HTML file to PDF Buffer using Puppeteer
   * @param {string} filePath - Absolute path to the HTML file
   * @param {object} customOptions - Optional custom PDF generation options
   * @returns {Promise<Buffer>} PDF Buffer
   */
  async convertHtmlFileToPdf(filePath, customOptions = {}) {
    const browser = getBrowser();
    let page = null;

    try {
      page = await browser.newPage();

      const htmlPath = "file://" + path.resolve(filePath);
      await page.goto(htmlPath, {
        waitUntil: "networkidle0",
      });

      const pdfOptions = {
        ...appConfig.pdfDefaults,
        ...customOptions,
      };

      const pdfBuffer = await page.pdf(pdfOptions);
      return pdfBuffer;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (closeErr) {
          console.error("⚠️ Failed to close Puppeteer page:", closeErr.message);
        }
      }
    }
  }
}

module.exports = new PdfService();
