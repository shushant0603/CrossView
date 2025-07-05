import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {  setupWebSocket } from './websocket/webSocket.js' 
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app=express();
dotenv.config();

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const server = http.createServer(app);
const io = new Server(server);
const PORT=process.env.PORT ;
// const io = new Server(server, {
//     cors: {
//       origin: "*"
//     }
//   });
// Attach socket handler
setupWebSocket(io);  

app.use("/api/auth",authRoutes);

app.get('/', (req, res) => {
    res.render('index');
  });
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




