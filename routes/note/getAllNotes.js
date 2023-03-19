import express from "express";
import ErrorRes from "../../models/error_res.js";
import Note from "../../models/note.js";
import User from "../../models/user.js";

const getAllNotes = express.Router();

/**
 * @headers access_token & user_id
 * @params id, which is the note id
 * @returns note object if found else error
 * @description gets note from the database using the note id
 */

getAllNotes.get("/", async (req, res) => {
  const access_token = req.headers["access_token"];
  const user_id = req.headers["user_id"];
  console.log("Hey");
  try {
    const user = await User.findById(user_id);
    if (user != null) {
      if (
        user.loggedIn &&
        user.token != "0" &&
        user.token != null &&
        user.token == access_token
      ) {
        const user_id = user._id;
        const response = await Note.find({ user_id: user_id });
        if (response.length <= 0)
          return res.status(401).json(new ErrorRes("No Notes Found!"));
        console.log(response);
        return res.json(response);
      } else {
        return res.status(401).json(new ErrorRes("Authentication failed."));
      }
    } else {
      return res.status(404).json(new ErrorRes("User not found."));
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ErrorRes("Something went wrong."));
  }
});

export default getAllNotes;
