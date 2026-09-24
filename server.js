const app = require("./src/app");
const appConfig = require("./src/config/app.config");
const { initBrowser, closeBrowser } = require("./src/config/puppeteer.config");

let server;

async function start() {
  try {
    // 1. Initialize Puppeteer / Chromium
    await initBrowser();

    // 2. Start Express Server
    server = app.listen(appConfig.port, "0.0.0.0", () => {
      console.log(`
========================================
 HTML TO PDF SERVICE
========================================
 Server : http://localhost:${appConfig.port}
 Health : http://localhost:${appConfig.port}/health
 API    : POST /api/convert-html-to-pdf
========================================
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown handling
async function shutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log("🔒 HTTP server closed");
      await closeBrowser();
      process.exit(0);
    });
  } else {
    await closeBrowser();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
