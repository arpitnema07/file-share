import express from "express";
import connectDb from "./config/db.js";
import uploadR from "./routes/upload.js";
import showR from "./routes/show.js";
import download from "./routes/download.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectDb();

// Routes
app.use("/api/upload", uploadR);

app.use("/api/files", showR);

app.use("/api/download", download);

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
