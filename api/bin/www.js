#!/usr/bin/env node

/**
 * Module dependencies.
 */
import { Server } from "socket.io";
import app from "../app.js";
import debugLib from "debug";
import http from "http";
const debug = debugLib("your-project-name:server");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

let users = [];

const newUser = (userID, socketId) => {
  if (!users.some((user) => user.userID === userID)) {
    users.push({ userID, socketId });
    console.log(users);
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userID) => {
  return users.find((user) => user.userID === userID);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userID) => {
    newUser(userID, socket.id);
  });

  socket.on("createNewNotification", (data) => {
    const user = getUser(data.receiverID);
    console.log(data);
    if (user != null) {
      io.to(user.socketId).emit("newNotification", data.notification);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
