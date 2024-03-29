import express from "express";
import mongoose from "mongoose";
import User from "../../models/user.js";
import Note from "../../models/note.js";
import ErrorRes from "../../models/error_res.js";

const addNote = express.Router();

/**
 * @headers access_token & user_id
 * @body title, content
 * @returns note object if saved else error
 * @description adds a note to the database
 */
addNote.post("/", async (req, res) => {
  const access_token = req.headers["access_token"];
  const user_id = req.headers["user_id"];
  const { title, text, isArchived } = req.body;
  console.log("t: " + access_token);
  console.log("tu: " + user_id);
  if (
    user_id == null ||
    user_id == "" ||
    access_token == null ||
    access_token == ""
  ) {
    return res
      .status(401)
      .json(
        new ErrorRes("Authentication failed, Required fields are missing.")
      );
  }
  if (
    title == null ||
    title == "" ||
    text == null ||
    text == "" ||
    isArchived == null ||
    isArchived == ""
  ) {
    return res.status(401).json(new ErrorRes("Note Details missing!"));
  }
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
        var _id = new mongoose.Types.ObjectId();
        const note = new Note({
          _id,
          user_id,
          title,
          text,
          isArchived,
        });
        const response = await note.save();
        console.log(response);
        return res.json({
          response: response,
          message: "Note added successfully...",
        });
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

export default addNote;
