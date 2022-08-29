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
});

export default download;
