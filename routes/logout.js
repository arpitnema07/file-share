import express from "express";
import User from "../models/user.js";

const logout = express.Router();

logout.post("/", async (req, res) => {
  const token = req.body.token;
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email, token: token });
    if (!user) {
      return res.json({
        status: false,
        response: "Unexpected Error, Please try again.",
      });
    }
    User.findOneAndUpdate(
      { token: token },
      { $set: { loggedIn: false, token: "0" } },
      { new: true },
      function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.json({
          status: true,
          response: "User Logged out Successfully",
        });
      }
    );
  } catch (error) {
    return res.json({
      status: false,
      response: "Something went wrong." + error.toString(),
    });
  }
});

export default logout;
