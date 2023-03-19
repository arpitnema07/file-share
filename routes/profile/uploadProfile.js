import dotenv from "dotenv";
import express from "express";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import User from "../../models/user.js";

import UserRes from "../../models/user_res.js";
import ErrorRes from "../../models/error_res.js";

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
      return res.status(400).json(new ErrorRes("Required fields are missing."));
    }
    // checking Image url
    let imageUrl;
    if (!req.file) {
      return res.status(400).json(new ErrorRes("File not Found!"));
    } else {
      imageUrl = process.env.URL + "/api/images/" + req.file.filename;
    }
    try {
      const user = await User.find({ _id: id });
      if (user.length > 0) {
        if (user[0].token == access_token) {
          user[0].imageUrl = imageUrl;
          const response = await user[0].save();
          console.log(response);
          return res.json({
            message: "Profile Updated!",
            response: new UserRes(response),
          });
        } else {
          return res.status(401).json(new ErrorRes("Authentication failed!"));
        }
      } else {
        return res
          .status(400)
          .json(new ErrorRes("User does not exist, Create a new account."));
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json(new ErrorRes("Something went wrong."));
    }
  });
});

export default uploadProfile;
