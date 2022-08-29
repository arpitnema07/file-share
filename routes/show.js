import express from "express";
import File from "../models/file.js";

const showR = express.Router();

showR.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.json({ error: "Link Expired" });
    }
    return res.json({
      uuid: file.uuid,
      filename: file.filename,
      size: file.size,
      downloadLink: `${process.env.URL}/api/download/${file.uuid}`,
    });
  } catch (error) {
    return res.json({ error: error });
  }
});

export default showR;
