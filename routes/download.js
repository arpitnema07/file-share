import express from "express";
import File from "../models/file.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const download = express.Router();

download.get("/:uuid", async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.json({ error: "Link Expired" });
  }
  const filePath = `${__dirname}/../${file.path}`;
  res.download(filePath);

  // const gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
  //   bucketName: "profileImages",
  // });
  // const gfs = Grid(conn.db, mongoose.mongo);
  // gfs.collection("profileImages").findOne({ _id: id }, (err, file) => {
  //   if (err) {
  //     return res.status(400).send(err);
  //   } else if (!file) {
  //     return res.status(404).send("Error on the database looking for the file.");
  //   } else {
  //     res.set("Content-Type", file.contentType);
  //     res.set(
  //       "Content-Disposition",
  //       'attachment; filename="' + file.filename + '"'
  //     );

  //     var readstream = gridfsBucket.openDownloadStream({
  //       _id: "630dfb862662876a43d2f66b",
  //     });

  //     readstream.on("error", function (err) {
  //       res.end();
  //     });
  //     readstream.pipe(res);
  //   }
  // });
});

export default download;
