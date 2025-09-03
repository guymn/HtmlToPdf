const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function convertHtmlToPdf(inputHtml, outputPdf) {
  // เปิด Chromium
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // โหลด HTML จากไฟล์
  const htmlPath = "file://" + path.resolve(inputHtml);
  await page.goto(htmlPath, { waitUntil: "networkidle0" });

  // ✅ Export เป็น PDF
  await page.pdf({
    path: outputPdf,
    format: "A4", // ถ้าอยากได้เอกสารพิมพ์ (เช่น A4)
    // width: "1920px",   // ถ้าอยากได้ตามขนาดจอจริง
    // height: "1080px",
    printBackground: true, // render background, สี, gradient
  });

  await browser.close();
  console.log(`✅ Saved PDF: ${outputPdf}`);
}

const html = "contract01_standard_act";
// ตัวอย่างการเรียก
convertHtmlToPdf(`${html}.html`, `${html}-output.pdf`);
//node html-to-pdf.js
