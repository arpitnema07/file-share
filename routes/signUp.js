import dotenv from "dotenv";
import express from "express";
import crypto, { pbkdf2Sync } from "crypto";
import User from "../models/user.js";
import ErrorRes from "../models/error_res.js";
import UserRes from "../models/user_res.js";
import { HASH, ITERATIONS, KEYLEN } from "../utils/constants.js";

dotenv.config();
const signUp = express.Router();

// Handling Sign Up Route
signUp.post("/", async (req, res) => {
  // getting email, username, pass and checking them
  const { email, username, pass } = req.body;
  if (
    email == null ||
    email == "" ||
    username == null ||
    username == "" ||
    pass == null ||
    pass == ""
  ) {
    return res.status(400).json(new ErrorRes("Required fields are missing."));
  }

  const _id = await crypto.randomUUID();
  try {
    const user = await User.find({ email: email });
    if (user.length > 0) {
      return res.status(400).json({
        message: "User exist with the given Email, Please Login.",
      });
    } else {
      const salt = crypto.randomBytes(128).toString("base64");
      // Implementing pbkdf2 with all its parameters
      var hashPass = (
        await pbkdf2Sync(
          pass,
          salt,
          ITERATIONS,
          KEYLEN,
          HASH,
          (err, derivedKey) => {
            if (err)
              return res
                .status(500)
                .json(new ErrorRes("Something went wrong."));
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
        imageUrl: "0",
        token,
        loggedIn,
      });
      const response = await user.save();

      return res.json({
        message: "User created Successfully",
        response: new UserRes(response),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ErrorRes("Something went wrong."));
  }
});

export default signUp;
