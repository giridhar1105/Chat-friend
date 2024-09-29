const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("message_sent", (message, room) => {
    console.log("Message received from client:", message);
    
    if (typeof message !== "string" || message.trim() === "") {
      console.warn("Invalid message:", message);
      return; // Prevent sending empty messages
    }

    if (room === "") {
      socket.broadcast.emit("message_received", message);
    } else {
      socket.to(room).emit("message_received", message);
    }
  });

  socket.on("room_join", (room) => {
    if (room) {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    } else {
      console.warn("Attempted to join an empty room");
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
