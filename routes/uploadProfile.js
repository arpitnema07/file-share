import dotenv from "dotenv";
import express from "express";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto, { pbkdf2Sync } from "crypto";
import multer from "multer";
import User from "../models/user.js";

dotenv.config();
const uploadProfile = express.Router();

// Setting up storage to store profile image
const storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      const fileInfo = {
        filename: filename,
        bucketName: "profileImages",
      };
      resolve(fileInfo);
    });
  },
});

let upload = multer({ storage }).single("profile");

// Handling Sign Up Route
uploadProfile.post("/", (req, res) => {
  upload(req, res, async (err) => {
    // getting email,username,pass and checking them
    console.log("Body");
    console.log(req.body);
    const { id, access_token } = req.body;
    if (id == null || id == "" || access_token == null || access_token == "") {
      return res.json({
        status: false,
        response: "Authentication failed.",
      });
    }
    // checking Image url
    let imageUrl;
    if (!req.file) {
      return res.json({
        status: false,
        response: "File not found.",
      });
    } else {
      imageUrl = process.env.URL + "/api/images/" + req.file.filename;
    }
    try {
      const user = await User.find({ _id: id });
      if (user.length > 0) {
        if (user[0].access_token == access_token) {
          user[0].profileImage = imageUrl;
          const response = await user[0].save();

          return res.json({
            status: true,
            response: "User created Successfully",
            id: response._id,
            email: response.email,
            username: response.username,
            imageUrl: response.imageUrl,
            token: response.token,
          });
        } else {
          return res.json({
            status: false,
            response: "Authentication failed.",
          });
        }
      } else {
        return res.json({
          status: false,
          response: "User Not Found.",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ status: false });
    }
  });
});

export default uploadProfile;
