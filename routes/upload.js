import express from "express";
import multer from "multer";
import path from "path";
import File from "../models/file.js";
import crypto from "crypto";

const uploadR = express.Router();

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cd) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cd(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 100000000 },
}).single("upload-file");

uploadR.post("/", (req, res) => {
  // Store File
  upload(req, res, async (err) => {
    // Validate Request

    if (!req.file) {
      return res.json({ error: "File Not Found, Try Again!" });
    }

    if (err) {
      return res.status(500).send({ error: err.massage });
    }

    // Store Into Database
    const file = new File({
      filename: req.file.filename,
      uuid: crypto.randomUUID(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();

    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });

  // Response -> Link
});

export default uploadR;
