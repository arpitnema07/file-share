import express from "express";
import File from "../models/file.js";

const showFile = express.Router();

showFile.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.json({ error: "Link Expired" });
    }
    return res.json({
      uuid: file.uuid,
      filename: file.filename,
      size: file.size,
      downloadLink: `${req.protocol + "://" + req.get("host")}/api/download/${
        file.uuid
      }`,
    });
  } catch (error) {
    return res.json({ error: error });
  }
});

export default showFile;
