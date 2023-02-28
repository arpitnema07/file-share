import express from "express";
import mongoose from "mongoose";
import { conn } from "../config/db.js";
import Grid from "gridfs-stream";

const images = express.Router();

images.get("/:filename", async (req, res) => {
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
    if (
      file.contentType === "image/jpg" ||
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png"
    ) {
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      return res.status(404).send("File not an image");
    }
  });
});
export default images;
