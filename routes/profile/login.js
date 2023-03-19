import express from "express";
import crypto, { pbkdf2Sync } from "crypto";
import User from "../../models/user.js";
import UserRes from "../../models/user_res.js";
import ErrorRes from "../../models/error_res.js";
import { HASH, ITERATIONS, KEYLEN } from "../utils/constants.js";

const login = express.Router();

/**
 * @body email & password
 * @returns user object if found else error
 * @description gets user from the database using the email and password
 * @description if user is found, then a token is generated and stored in the database
 * @description the token is then sent back to the user
 * @description the token is used for authentication
 */

login.post("/", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  if (email == null || email == "" || pass == null || pass == "") {
    return res.status(400).json(new ErrorRes("Required fields are missing."));
  }
  console.log(email + " " + pass);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json(new ErrorRes("User does not exist, Create a new account."));
    }
    // if(user.loggedIn && user.token != "0" && user.token != null){
    //   return res.status(400).json(new ErrorRes("User already logged in."));
    // }
    const salt = user.salt;
    var hashPass = pbkdf2Sync(pass, salt, ITERATIONS, KEYLEN, HASH, (err) => {
      if (err) {
        return res.status(500).json(new ErrorRes("Something went wrong."));
      }
    }).toString("hex");
    if (hashPass == user.hashPass) {
      //Login Success
      const token = await crypto.randomUUID();
      User.findOneAndUpdate(
        { email: email },
        { $set: { token: token, loggedIn: true } },
        { new: true },
        function (err, doc) {
          if (err) {
            console.log(err);
            return res.status(500).json(new ErrorRes(`Something went wrong.`));
          }
          return res.json({
            message: "User Logged in Successfully",
            response: new UserRes(doc),
          });
        }
      );
    } else {
      return res
        .status(401)
        .json(new ErrorRes("Authentication failed, Wrong password."));
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ErrorRes("Something went wrong."));
  }
});

export default login;
