# HTML to PDF Service

A high-performance HTML to PDF conversion microservice built with Express and Puppeteer, structured using a clean Layered Architecture (Spring Boot style).

## Project Architecture

```
HtmlToPdf/
├── src/
│   ├── config/
│   │   ├── app.config.js          # Port, CORS, temp paths, PDF defaults
│   │   └── puppeteer.config.js    # Puppeteer lifecycle & singleton instance
│   ├── controllers/
│   │   ├── health.controller.js   # Health check controller
│   │   └── pdf.controller.js      # PDF request validation & response handling
│   ├── services/
│   │   └── pdf.service.js         # Core PDF generation business logic
│   ├── routes/
│   │   ├── index.js               # Route aggregator
│   │   ├── health.routes.js       # /health routes
│   │   └── pdf.routes.js          # /api/convert-html-to-pdf routes
│   ├── middlewares/
│   │   ├── upload.middleware.js   # Multer file upload handling
│   │   └── error.middleware.js    # Global error handling
│   └── app.js                     # Express app configuration
├── server.js                      # Application bootstrap & graceful shutdown
├── Dockerfile                     # Container deployment
└── package.json
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm start
```

## API Endpoints

### 1. Health Check
- **URL**: `GET /health`
- **Response**:
```json
{
  "success": true,
  "service": "html-to-pdf",
  "status": "UP"
}
```

### 2. Convert HTML to PDF
- **URL**: `POST /api/convert-html-to-pdf`
- **Content-Type**: `multipart/form-data`
- **Body Parameter**: `file` (HTML file with `.html` or `.htm` extension)
- **Response**: `application/pdf` binary stream