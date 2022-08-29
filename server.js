import express from "express";
import connectDb from "./config/db.js";
import uploadR from "./routes/upload.js";
import showR from "./routes/show.js";
import download from "./routes/download.js";
import http from "http";

const app = express();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

server.on("listening", onListening);

app.use(express.json());
connectDb();

// Routes
app.use("/api/upload", uploadR);

app.use("/api/files", showR);

app.use("/api/download", download);

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
