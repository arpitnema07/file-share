import express from "express";
import User from "../../models/user.js";
import Note from "../../models/note.js";
import ErrorRes from "../../models/error_res.js";

const deleteNotes = express.Router();

/**
 * @headers access_token & user_id
 * @body note_ids
 * @returns success message if notes deleted else error
 * @description deletes multiple notes from the database
 */
deleteNotes.delete("/", async (req, res) => {
  const access_token = req.headers["access_token"];
  const user_id = req.headers["user_id"];
  const note_ids = req.query.note_ids.split(",");

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

  if (note_ids == null || note_ids.length == 0) {
    return res.status(401).json(new ErrorRes("Note IDs missing!"));
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
        const notes = await Note.find({
          _id: { $in: note_ids },
          user_id: user_id,
        });
        if (notes.length > 0) {
          await Note.deleteMany({ _id: { $in: note_ids }, user_id: user_id });
          return res.json({
            message: "Notes deleted successfully.",
          });
        } else {
          return res.status(404).json(new ErrorRes("Notes not found."));
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

export default deleteNotes;
