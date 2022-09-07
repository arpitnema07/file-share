import express from "express";
import mongoose from "mongoose";
import { conn } from "../config/db.js";
import Grid from "gridfs-stream";

const download = express.Router();

download.get("/:filename", async (req, res) => {
  const gfs = Grid(conn.db, mongoose.mongo);

  gfs.collection("profileImages");

  const gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "profileImages",
  });
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // Download
    res.set("Content-Type", file.contentType);
    res.set(
      "Content-Disposition",
      'attachment; filename="' + file.filename + '"'
    );

    const readstream = gridfsBucket.openDownloadStream(file._id);
    readstream.pipe(res);
  });
});

export default download;
