import express from "express";
import crypto, { pbkdf2Sync } from "crypto";
import User from "../models/user.js";

const login = express.Router();

login.post("/", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        status: false,
        response: "User doesn't exist, Create New Account.",
      });
    }
    var iterations = 10000;
    var keylen = 64;

    var hashPass = (
      await pbkdf2Sync(pass, user.salt, iterations, keylen, "sha512", (err) => {
        if (err) throw err;
      })
    ).toString("hex");
    if (hashPass == user.hashPass) {
      //Login Success
      const token = crypto.randomUUID();

      User.findOneAndUpdate(
        { email: email },
        { $set: { token: token, loggedIn: true } },
        { new: true },
        function (err, doc) {
          if (err) return res.send(500, { error: err });
          return res.json({
            status: true,
            response: "User Logged in Successfully",
            email: doc.email,
            username: doc.username,
            imageUrl: doc.imageUrl,
            token: doc.token,
          });
        }
      );
    } else {
      return res.json({
        status: false,
        response: "Authentication Failed, Wrong Password.",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response: "Something went wrong." + error.toString(),
    });
  }
});

export default login;
