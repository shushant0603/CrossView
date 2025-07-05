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
  
      function getRoom(socket) {
        return [...socket.rooms][1]; // Get room code (skip socket.id)
      }
    });
  };
  