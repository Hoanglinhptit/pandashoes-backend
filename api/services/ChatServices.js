// Store messages and connected users
const { model } = require("mongoose");
const response = require("../common/response");
const messages = [];
const connectedUsers = {};

// Event handler for new connections
function handleConnection(socket) {
  console.log("A user connected");

  socket.on("join room", (roomId, username) => {
    console.log(roomId, username);
    socket.join(roomId);
    console.log("line4",connectedUsers);
    connectedUsers[socket.id] = {
      username: username, // Assign username directly
      roomId: roomId, // Assign roomId directly
    };
    console.log("connectedUsers[socket.id]", connectedUsers[socket.id]);
    socket.to(roomId).emit("user list", getUserList(roomId));
    socket.emit("chat history", getChatHistory(roomId));
  });

  socket.on("chat message", (roomId, message) => {
    console.log("message", message);
    console.log(socket.id);
    if (isUserOrAdmin(socket.id)) {
      const chatMessage = {
        username: connectedUsers[socket.id].username,
        message,
        timestamp: new Date(),
      };
      messages[roomId].push(chatMessage);

      io.to(roomId).emit("chat message", chatMessage);
    }
  });

  socket.on("file upload", (roomId, file) => {
    if (isUserOrAdmin(socket.id)) {
      const oldPath = file.path;
      const newPath = `uploads/${file.originalname}`;
      fs.renameSync(oldPath, newPath);

      const fileInfo = {
        username: connectedUsers[socket.id].username,
        filename: file.originalname,
        path: newPath,
        timestamp: new Date(),
      };
      io.to(roomId).emit("file uploaded", fileInfo);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete connectedUsers[socket.id];
  });
}

// Check if the user is a user or an admin
function isUserOrAdmin(socketId) {
  const user = connectedUsers[socketId];
  return user.role === "user" || user.role === "admin";
}

// Get the list of connected users in a specific chat room
function getUserList(roomId) {
  console.log("line 61",connectedUsers);
  const userList = [];
  for (const socketId in connectedUsers) {
    const user = connectedUsers[socketId];
    if (user.roomId.roomId  === roomId.roomId) {
      userList.push(user.username.username);
    }
  }
  console.log(userList);
  return userList;
}

// Get the chat history for a specific chat room
function getChatHistory(roomId) {
  return messages[roomId] || [];
}

const chatService = (req, res, next) => {
  try {
    console.log("isworking");
    const { roomId, username } = req.query;
    const userExists = Object.values(connectedUsers).some(
      (user) => user.roomId === roomId && user.username === username
    );
    if (userExists) {
      return res.status(409).json({ error: "User already exists in the room" });
    }

    // Join the specified chat room
    socket.join(roomId);

    // Store the username and room ID for the connected user
    connectedUsers[socket.id] = {
      username,
      roomId,
      role: "user", // Set the role as 'user' for now, you can modify this based on your authentication logic
    };

    // Emit the list of connected users to the client
    io.to(roomId).emit("user list", getUserList(roomId));

    // Emit the chat history to the client

    // Emit the chat history to the client
    socket.emit("chat history", getChatHistory(roomId));

    res.json(response.success({ msg: "Success" }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatService,
  handleConnection,
};
