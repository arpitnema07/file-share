import dotenv from "dotenv";
import express from "express";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto, { pbkdf2Sync } from "crypto";
import multer from "multer";
import User from "../models/user.js";

dotenv.config();
const signUp = express.Router();

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
signUp.post("/", (req, res) => {
  upload(req, res, async (err) => {
    // getting email,username,pass and checking them
    console.log("Body");
    console.log(req.body);
    const { email, username, pass } = req.body;
    if (
      email == null ||
      email == "" ||
      username == null ||
      username == "" ||
      pass == null ||
      pass == ""
    ) {
      return res.json({
        status: false,
        response: "Required fields are missing.",
      });
    }
    // checking Image url
    let imageUrl;
    if (!req.file) {
      imageUrl = "0";
    } else {
      imageUrl = process.env.URL + "/api/images/" + req.file.id;
    }

    //
    const _id = crypto.randomUUID();
    try {
      const user = await User.find({ email: email });
      if (user.length > 0) {
        return res.json({
          status: false,
          response: "User exist with the given Email, Please Login.",
        });
      } else {
        const salt = crypto.randomBytes(128).toString("base64");
        // Implementing pbkdf2 with all its parameters
        var iterations = 10000;
        var keylen = 64;

        var hashPass = (
          await pbkdf2Sync(
            pass,
            salt,
            iterations,
            keylen,
            "sha512",
            (err, derivedKey) => {
              if (err) throw err;
            }
          )
        ).toString("hex");

        console.log("Hash:" + hashPass);
        const token = crypto.randomUUID();
        const loggedIn = true;
        const user = new User({
          _id,
          email,
          username,
          hashPass,
          salt,
          imageUrl,
          token,
          loggedIn,
        });
        const response = await user.save();

        return res.json({
          status: true,
          response: "User created Successfully",
          email: response.email,
          username: response.username,
          imageUrl: response.imageUrl,
          token: response.token,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ status: false });
    }
  });
});

export default signUp;
