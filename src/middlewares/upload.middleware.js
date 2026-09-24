const multer = require("multer");
const path = require("path");
const fs = require("fs");
const appConfig = require("../config/app.config");

// Ensure temp directory exists
if (!fs.existsSync(appConfig.tempDir)) {
  fs.mkdirSync(appConfig.tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appConfig.tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
