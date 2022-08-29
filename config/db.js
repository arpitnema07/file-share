import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

function connectDb() {
  // Database connection

  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.on("error", (err) => {
    console.log("Could not connect to mongo server!");
    console.log(err);
  });
  connection.once("open", () => {
    console.log("Database connected.");
  });
}

export default connectDb;
