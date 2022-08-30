import express from "express";
import mongoose from "mongoose";
import { conn } from "../config/db.js";
import Grid from "gridfs-stream";

const images = express.Router();

images.get("/:id", async (req, res) => {
  const id = req.params.id;
  const gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "profileImages",
  });
  const gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("profileImages").findOne({ _id: id }, (err, file) => {
    if (err) {
      return res.status(400).send(err);
    } else if (!file) {
      return res
        .status(404)
        .send("Error on the database looking for the file.");
    } else {
      res.set("Content-Type", file.contentType);
      res.set(
        "Content-Disposition",
        'attachment; filename="' + file.filename + '"'
      );
      var readstream = gridfsBucket.openDownloadStream({
        _id: id,
      });
      readstream.on("error", function (err) {
        res.end();
      });
      readstream.pipe(res);
    }
  });
});
export default images;
