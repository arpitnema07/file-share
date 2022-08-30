import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    hashPass: { type: String, required: true },
    salt: { type: String, required: true },
    imageUrl: { type: String, required: false },
    token: { type: String, required: false },
    loggedIn: { type: Boolean, required: true },
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
export default mongoose.model("User", userSchema);
