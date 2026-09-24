const fs = require("fs");
const path = require("path");
const pdfService = require("../services/pdf.service");

class PdfController {
  /**
   * Convert uploaded HTML file to PDF
   */
  async convertHtmlToPdf(req, res, next) {
    const htmlFile = req.file;

    // Validate file presence
    if (!htmlFile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const ext = path.extname(htmlFile.originalname).toLowerCase();

    // Validate HTML file extension
    if (![".html", ".htm"].includes(ext)) {
      if (fs.existsSync(htmlFile.path)) {
        try {
          fs.unlinkSync(htmlFile.path);
        } catch (unlinkErr) {
          console.error("⚠️ Failed to delete invalid file:", unlinkErr.message);
        }
      }

      return res.status(400).json({
        success: false,
        message: "Uploaded file is not valid HTML",
      });
    }

    try {
      console.log(`📄 Converting: ${htmlFile.originalname}`);

      // Call Service to generate PDF Buffer
      const pdfBuffer = await pdfService.convertHtmlFileToPdf(htmlFile.path);

      const baseName = path.basename(htmlFile.originalname, ext);
      const pdfFileName = `${baseName}.pdf`;

      // Set Response Headers
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfFileName}"`,
        "Content-Length": pdfBuffer.length,
      });

      res.send(pdfBuffer);
      console.log(`✅ PDF generated: ${pdfFileName}`);
    } catch (err) {
      console.error("❌ PDF conversion error:", err);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to convert HTML to PDF",
          error: err.message,
        });
      }
    } finally {
      // Clean up temporary uploaded file
      if (htmlFile && fs.existsSync(htmlFile.path)) {
        try {
          fs.unlinkSync(htmlFile.path);
        } catch (unlinkErr) {
          console.error("⚠️ Failed to delete temporary file:", unlinkErr.message);
        }
      }
    }
  }
}

module.exports = new PdfController();
