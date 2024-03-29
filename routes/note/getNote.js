import express from "express";
import ErrorRes from "../../models/error_res.js";
import Note from "../../models/note.js";
import User from "../../models/user.js";

const getNote = express.Router();

/**
 * @headers access_token & user_id
 * @params id, which is the note id
 * @returns note object if found else error
 * @description gets note from the database using the note id
 */

getNote.get("/:id", async (req, res) => {
  const access_token = req.headers["access_token"];
  const user_id = req.headers["user_id"];
  const id = req.params["id"];
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
        const note = await Note.findById(id);
        if (note != null) {
          if (note.user_id == user_id) {
            return res.json(note);
          } else {
            return res.status(401).json(new ErrorRes("Unauthorized access."));
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
    return res.status(404).json(new ErrorRes("Something went wrong."));
  }
});

export default getNote;
