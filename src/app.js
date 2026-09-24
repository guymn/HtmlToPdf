const express = require("express");
const cors = require("cors");
const appConfig = require("./config/app.config");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// ========================================
// Middlewares
// ========================================
app.use(cors(appConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// Routes
// ========================================
app.use("/", routes);

// ========================================
// Error Handlers
// ========================================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
