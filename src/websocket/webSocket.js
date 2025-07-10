export const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Create Room
    socket.on('create-room', () => {
      const roomCode = Math.random().toString(36).substring(2, 8);
      socket.join(roomCode);
      socket.emit('room-created', roomCode);
    });

    // Join Room
    socket.on('join-room', (roomCode) => {
      const room = io.sockets.adapter.rooms.get(roomCode);
      if (room) {
        socket.join(roomCode);
        socket.emit('room-joined', roomCode);
      } else {
        socket.emit('error', 'Room not found');
      }
    });

    // Relay offer
    socket.on('offer', (offer) => {
      socket.to(getRoom(socket)).emit('offer', offer);
    });

    // Relay answer
    socket.on('answer', (answer) => {
      socket.to(getRoom(socket)).emit('answer', answer);
    });

    // Relay ICE candidate
    socket.on('ice-candidate', (candidate) => {
      socket.to(getRoom(socket)).emit('ice-candidate', candidate);
    });

    // Relay Chat Message
    socket.on('chat-message', (msg) => {
      socket.to(getRoom(socket)).emit('chat-message', msg);
    });

    // Relay Stop Video
    socket.on('stop-video', () => {
      socket.to(getRoom(socket)).emit('stop-video');
    });

    // ✅ Relay Resume Video (missing earlier)
    socket.on('resume-video', () => {
      socket.to(getRoom(socket)).emit('resume-video');
    });
  // 🔄 Relay Canvas Drawing Event
  socket.on('draw', (data) => {
    socket.to(getRoom(socket)).emit('draw', data);
  });

    // Utility: Get the room joined (other than socket.id)
    function getRoom(socket) {
      const rooms = [...socket.rooms];
      return rooms.length > 1 ? rooms[1] : null;
    }
  });
};
