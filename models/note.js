import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    isMedia: { type: Boolean, required: false },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: false,
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Note", noteSchema);
