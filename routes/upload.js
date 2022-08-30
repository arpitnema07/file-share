import express from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import path from "path";
import File from "../models/file.js";
import crypto from "crypto";

const uploadFile = express.Router();

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

uploadFile.post("/", (req, res) => {
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
      file: `${req.protocol + "://" + req.get("host")}/files/${response.uuid}`,
    });
  });
});

export default uploadFile;
