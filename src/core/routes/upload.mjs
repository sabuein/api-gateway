"use strict";

// /src/core/routes/upload.mjs
const multer = require('multer');
const express = require('express');
const app = express();

// set up the storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

//Create the multer middleware
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  //Do something with the file
  res.send('File uploaded');
});
