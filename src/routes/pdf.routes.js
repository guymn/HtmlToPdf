const express = require("express");
const upload = require("../middlewares/upload.middleware");
const pdfController = require("../controllers/pdf.controller");

const router = express.Router();

// POST /api/convert-html-to-pdf
router.post(
  "/convert-html-to-pdf",
  upload.single("file"),
  (req, res, next) => pdfController.convertHtmlToPdf(req, res, next),
);

module.exports = router;
