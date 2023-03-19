import express from "express";
import ErrorRes from "../models/error_res.js";
import User from "../models/user.js";

const logout = express.Router();

/**
 * @headers access_token & user_id
 * @returns success message if logged out else error
 * @description logs out the user
 */

logout.post("/", async (req, res) => {
  const token = req.headers["access_token"];
  const user_id = req.headers["user_id"];
  if (token == null || token == "" || user_id == null || user_id == "") {
    return res
      .status(401)
      .json(
        new ErrorRes("Authentication failed, Required fields are missing.")
      );
  }
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json(new ErrorRes("Unknown Error, User not found."));
    }
    User.findOneAndUpdate(
      { token: token },
      { $set: { loggedIn: false, token: "0" } },
      { new: true },
      function (err, doc) {
        if (err) return res.status(500).json(new ErrorRes(err));
        return res.json({
          status: true,
          message: "User Logged out Successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ErrorRes("Something went wrong."));
  }
});

export default logout;
