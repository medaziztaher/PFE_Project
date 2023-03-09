const express = require("express");
const user = require("./routers/user");
const medicament = require("./routers/medicament");
const question = require("./routers/question");
const reponse = require("./routers/reponse");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./Models/models");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const bodyParser = require('express').json;
const port = 5002;
app.use(bodyParser());
app.use(cors("*"));
require("./Connexion/connexion");
app.use(user);
app.use(medicament);
app.use(question);
app.use(reponse);

// Listen for new connections to the socket.io server
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for the "message" event
  socket.on("message", async (data) => {
    try {
      const { emitterId, receiverId, messageText } = data;

      const newMessage = await db.message.create({
        _emeteur: emitterId,
        _recepteur: receiverId,
        message_texte: messageText,
      });

      // Emit a message event to all connected clients
      io.emit("message", newMessage);
    } catch (error) {
      console.error(error);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on: ${port}`);
});
