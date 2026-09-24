/**
 * Handle 404 Not Found
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Global Error Handler (similar to @ControllerAdvice in Spring Boot)
 */
function errorHandler(err, req, res, next) {
  console.error("💥 Unhandled Error:", err);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
