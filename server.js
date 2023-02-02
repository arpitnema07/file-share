import express from "express";
import http from "http";
import connectDb from "./config/db.js";
import uploadFile from "./routes/upload.js";
import showFile from "./routes/showFile.js";
import download from "./routes/download.js";
import signUp from "./routes/signUp.js";
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import images from "./routes/images.js";
import uploadProfile from "./routes/uploadProfile.js";
import addNote from "./routes/addNote.js";
import getNote from "./routes/getNote.js";
import getAllNotes from "./routes/getAllNotes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Connection and Setting up environment
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
const server = http.createServer(app);
server.listen(port);
server.on("listening", onListening);

connectDb();

// Routes
/** 1. Root Route */
app.get("/", (_req, res) => res.send("Connected"));

/** 2. Greet Route */
app.get("/greet", (_req, res) => res.send("Hello User"));

/** 3. Upload Route */
app.use("/api/upload", uploadFile);

/** 4. Uploaded Files Route */
app.use("/api/files", showFile);

/** 5. Download Files Route */
app.use("/api/download", download);

/** 6. Sign Up Route */
app.use("/api/signup", signUp);

/** 7. Login Route */
app.use("/api/login", login);

/** 8. Logout Route */
app.use("/api/logout", logout);

/** 9. Profile Images Route */
app.use("/api/images", images);

/** 10. Upload Profile Route */
app.use("/api/uploadProfile", uploadProfile);

/** 11. NOTES ADD ROUTE */
app.use("/api/addNote", addNote);

/** 12. Get Note Route */
app.use("/api/getNote", getNote);

/** 12. Get Note Route */
app.use("/api/getAllNotes", getAllNotes);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("App started. Listening on " + bind);
}
