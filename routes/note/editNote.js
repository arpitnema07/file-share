import express from "express";
import mongoose from "mongoose";
import User from "../../models/user.js";
import Note from "../../models/note.js";
import ErrorRes from "../../models/error_res.js";

const editNote = express.Router();

/**
 * @headers access_token & user_id
 * @body title, content, note_id
 * @returns note object if saved else error
 * @description edit a note and save it to the database
 */
editNote.post("/:note_id", async (req, res) => {
  const access_token = req.headers["access_token"];
  const user_id = req.headers["user_id"];
  console.log(req.params);
  const note_id = req.params.note_id;
  const { title, text } = req.body;
  console.log("t: " + access_token);
  console.log("tu: " + user_id);
  console.log(title + text);
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
  if (note_id == null || note_id == "") {
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
        const note = await Note.findById(note_id);
        if (note != null) {
          if (note.user_id == user_id) {
            if (title != null || title != "") {
              note.title = title;
            } else {
              note.title = note.title;
            }
            if (text != null || text != "") {
              note.text = text;
            } else {
              note.text = note.text;
            }
            const resp = await note.save();
            console.error("Heerereree");
            console.log(resp);
            return res.json({
              response: resp,
              message: "Note edited successfully.",
            });
          } else {
            return res
              .status(401)
              .json(
                new ErrorRes(
                  "Authentication failed, You don't have access to this note."
                )
              );
          }
        } else {
          return res.status(404).json(new ErrorRes("Note not found."));
        }
      } else {
        return res.status(401).json(new ErrorRes("Authentication failed."));
      }
    } else {
      return res.status(404).json(new ErrorRes("User not found."));
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ErrorRes("Something went wrong." + error));
  }
});

export default editNote;
