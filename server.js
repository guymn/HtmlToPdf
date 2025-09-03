// server.js (Node.js)
const express = require("express");
const cors = require("cors"); // ✅ import cors
const multer = require("multer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const app = express();

// ✅ เปิด CORS
app.use(
  cors({
    origin: "http://localhost:4200", // ให้เฉพาะ frontend Angular
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ กำหนด storage ให้ Multer เก็บไฟล์พร้อมนามสกุล
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/"); // โฟลเดอร์ temp
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);
    cb(null, baseName + "-" + Date.now() + ext); // myfile-1693827229371.html
  },
});

const upload = multer({ storage });

app.post("/convert-html-to-pdf", upload.single("file"), async (req, res) => {
  const htmlFile = req.file;
  if (!htmlFile) return res.status(400).send("No file uploaded");

  // ✅ ตรวจสอบว่าเป็น HTML
  const ext = path.extname(htmlFile.originalname).toLowerCase();
  if (htmlFile.mimetype !== "text/html" || ![".html", ".htm"].includes(ext)) {
    fs.unlinkSync(htmlFile.path); // ลบไฟล์ temp
    return res.status(400).send("Uploaded file is not valid HTML");
  }

  try {
    // เปิด Chromium
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // โหลด HTML จากไฟล์
    const htmlPath = "file://" + path.resolve(htmlFile.path);
    await page.goto(htmlPath, { waitUntil: "networkidle0" });

    // ✅ Export เป็น PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ลบไฟล์ HTML ชั่วคราว
    fs.unlinkSync(htmlFile.path);

    // ใช้ชื่อไฟล์ต้นฉบับเป็นชื่อ PDF
    const pdfFileName = path.basename(htmlFile.originalname, ext) + ".pdf";

    // ส่ง PDF กลับ frontend
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfFileName}"`,
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    // ลบไฟล์ temp แม้เกิด error
    if (fs.existsSync(htmlFile.path)) fs.unlinkSync(htmlFile.path);
    res.status(500).send("Failed to convert HTML to PDF");
  }
});

app.listen(3000, () => console.log("Node.js service running on port 3000"));
