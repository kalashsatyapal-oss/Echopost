// Middleware/upload.js
import multer from "multer";

// Store files in memory for base64 encoding
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
