const express = require("express");
const healthController = require("../controllers/health.controller");

const router = express.Router();

// GET /health
router.get("/", (req, res) => healthController.checkHealth(req, res));

module.exports = router;
