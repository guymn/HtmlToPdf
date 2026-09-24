const path = require("path");

const appConfig = {
  port: process.env.PORT || 3000,
  tempDir: path.join(__dirname, "../../tmp"),
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
  pdfDefaults: {
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "15mm",
      bottom: "20mm",
      left: "15mm",
    },
  },
};

module.exports = appConfig;
