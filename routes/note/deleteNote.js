import express from "express";
import User from "../../models/user.js";
import Note from "../../models/note.js";
import ErrorRes from "../../models/error_res.js";

const deleteNote = express.Router();

/**
 * @headers access_token & user_id
 * @params note_id
 * @returns success message if note deleted else error
 * @description deletes a note from the database
 */
deleteNote.delete("/:note_id", async (req, res) => {
  const access_token = req.headers["access_token"];
  const user_id = req.headers["user_id"];
  const note_id = req.params.note_id;

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

  try {
    const user = await User.findById(user_id);
    if (user != null) {
      if (
        user.loggedIn &&
        user.token != "0" &&
        user.token != null &&
        user.token == access_token
      ) {
        const note = await Note.findById(note_id);
        if (note != null && note.user_id.toString() === user_id.toString()) {
          await note.delete();
          return res.json({
            message: "Note deleted successfully.",
          });
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
    return res.status(404).json(new ErrorRes("Something went wrong."));
  }
});

export default deleteNote;
