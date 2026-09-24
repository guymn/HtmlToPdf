const express = require("express");
const healthRoutes = require("./health.routes");
const pdfRoutes = require("./pdf.routes");

const router = express.Router();

// Mount route modules
router.use("/health", healthRoutes);
router.use("/api", pdfRoutes);

module.exports = router;
