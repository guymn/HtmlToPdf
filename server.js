const express = require("express");
const cors = require("cors");
const multer = require("multer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

let browser;

// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

// ========================================
// Puppeteer
// ========================================

async function initBrowser() {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  console.log("✅ Chromium started");
}

// ========================================
// Multer
// ========================================

const tempDir = path.join(__dirname, "tmp");

// สร้าง tmp ถ้ายังไม่มี
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const baseName = path.basename(file.originalname, ext);

    cb(null, baseName + "-" + Date.now() + ext);
  },
});

const upload = multer({
  storage,
});

// ========================================
// Health Check
// ========================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "html-to-pdf",
    status: "UP",
  });
});

// ========================================
// HTML -> PDF
// ========================================

app.post(
  "/api/convert-html-to-pdf",
  upload.single("file"),
  async (req, res) => {
    const htmlFile = req.file;

    if (!htmlFile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const ext = path.extname(htmlFile.originalname).toLowerCase();

    // ========================================
    // Validate HTML
    // ========================================

    if (![".html", ".htm"].includes(ext)) {
      if (fs.existsSync(htmlFile.path)) {
        fs.unlinkSync(htmlFile.path);
      }

      return res.status(400).json({
        success: false,
        message: "Uploaded file is not valid HTML",
      });
    }

    let page;

    try {
      console.log(`📄 Converting: ${htmlFile.originalname}`);

      // ========================================
      // New Page
      // ========================================

      page = await browser.newPage();

      // ========================================
      // Load HTML
      // ========================================

      const htmlPath = "file://" + path.resolve(htmlFile.path);

      await page.goto(htmlPath, {
        waitUntil: "networkidle0",
      });

      // ========================================
      // Generate PDF
      // ========================================

      const pdfBuffer = await page.pdf({
        format: "A4",

        printBackground: true,

        margin: {
          top: "20mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        },
      });

      // ========================================
      // Close Page
      // ========================================

      await page.close();
      page = null;

      // ========================================
      // Delete temporary HTML
      // ========================================

      if (fs.existsSync(htmlFile.path)) {
        fs.unlinkSync(htmlFile.path);
      }

      // ========================================
      // PDF filename
      // ========================================

      const pdfFileName = path.basename(htmlFile.originalname, ext) + ".pdf";

      // ========================================
      // Response
      // ========================================

      res.set({
        "Content-Type": "application/pdf",

        "Content-Disposition": `attachment; filename="${pdfFileName}"`,

        "Content-Length": pdfBuffer.length,
      });

      res.send(pdfBuffer);

      console.log(`✅ PDF generated: ${pdfFileName}`);
    } catch (err) {
      console.error("❌ PDF conversion error:", err);

      // Close page
      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.error(e);
        }
      }

      // Delete temp file
      if (htmlFile && fs.existsSync(htmlFile.path)) {
        try {
          fs.unlinkSync(htmlFile.path);
        } catch (e) {
          console.error(e);
        }
      }

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to convert HTML to PDF",
          error: err.message,
        });
      }
    }
  },
);

// ========================================
// Start Server
// ========================================

async function start() {
  try {
    await initBrowser();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`
========================================
 HTML TO PDF SERVICE
========================================
 Server : http://localhost:${PORT}
 Health : http://localhost:${PORT}/health
 API    : POST /api/convert-html-to-pdf
========================================
        `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);

    process.exit(1);
  }
}

start();
