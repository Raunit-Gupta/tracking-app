// import express from "express";
// const app = express();
// import path from "path";

// import { Server } from "socket.io";
// import http from "http";
// const server = http.createServer(app);
// const io = new Server(server);


// // ejs setup

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, 'public')));



// // handling the connection request comming from socket io

// io.on("connection", (socket) => {
//   console.log("a user connected");
// });


// app.get("/", (req, res) => {
//   res.render("index");
// });

// server.listen(3000, () => {
//   console.log("Server is running on port http://localhost:3000");
// });



import express from "express";
import path from "path";
import { fileURLToPath } from "url";  // Required to recreate __dirname in ES modules

const app = express();

import { Server } from "socket.io";
import http from "http";
const server = http.createServer(app);
const io = new Server(server);

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ejs setup
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle Socket.IO connection requests
io.on("connection", (socket) => {
  // send-location emitted is excepted here
  // taken from frontend here and send to all users from the backend here
  socket.on("send-location", (data) => {
    io.emit("receive-location", {id: socket.id, ...data});
  })
  console.log("A user connected");

  // Handle socket disconnection
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

// Render the 'index.ejs' file on the root URL
app.get("/", (req, res) => {
  res.render("index");  // Make sure 'index.ejs' is in the 'views' directory
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
