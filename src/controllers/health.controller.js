class HealthController {
  /**
   * Health check endpoint
   */
  checkHealth(req, res) {
    res.json({
      success: true,
      service: "html-to-pdf",
      status: "UP",
    });
  }
}

module.exports = new HealthController();
