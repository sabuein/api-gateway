"use strict";

// /src/core/routes/upload.mjs
import multer from "multer";

const uniqueSuffix = () => Date.now() + "-" + Math.round(Math.random() * 1E9);
const mimeTypeToExtension = (mimeType) => {
  const mimeToExtMap = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
    "application/json": ".json",
    "application/zip": ".zip",
    "application/xml": ".xml",
    "text/plain": ".txt",
    "text/html": ".html",
    "text/css": ".css",
    "text/javascript": ".js",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/ogg": ".ogg",
    "audio/wav": ".wav",

    // Office document mappings
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  };

  return mimeToExtMap[mimeType] || null; // Return null if MIME type is not found
};

/** The memory storage engine stores the files in memory as Buffer objects. It doesn't have any options. */
const memory = multer.memoryStorage();

/** Set up the storage for uploaded files. */
const disk = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "uploads/"),
  filename: (req, file, callback) => callback(null, uniqueSuffix() + mimeTypeToExtension(file.mimetype))
});

/** Create the multer middleware */
const upload = multer({
  storage: disk,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB
  }
});

export default upload;