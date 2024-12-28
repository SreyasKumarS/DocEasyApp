import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// import {sendMessage}  from './controllers/patientController.js'; 
import patientController from './controllers/patientController.js';
import { refreshAccessToken } from './utils/refreshToken.js';
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
const allowedOrigins = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
//---------------------morgan----------------------------------------------
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory); // Create 'logs/' directory if it doesn't exist
}
const accessLogStream = rfs.createStream('access.log', {
    interval: '7d', // Rotate logs every 7 days
    path: logDirectory,
});
app.use(morgan('combined', { stream: accessLogStream }));
//-------------------------------------------------------------------------
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/patients', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.post('/api/refresh-token', refreshAccessToken);
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
app.get('/', (req, res) => {
    res.send('Server is ready');
});
// Create HTTP server
const server = http.createServer(app);
// WebSocket setup with Socket.IO
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    },
});
// Socket.IO events------------------------------------------------------------------------------------
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    console.log(`Active clients: ${io.engine.clientsCount}`);
    // Listen for notification events
    socket.on('sendNotification', (data) => {
        console.log('Notification received:', data);
        io.emit('receiveNotification', data);
    });
    //--chat events-------------------------------------------------------------------------------------
    socket.on('joinRoom', ({ patientId, doctorId }) => {
        const room = `${patientId}-${doctorId}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
    });
    socket.on('leaveRoom', ({ patientId, doctorId }) => {
        const room = `${patientId}-${doctorId}`;
        socket.leave(room);
        console.log(`Socket ${socket.id} left room: ${room}`);
    });
    socket.on('sendChatMessage', async (data) => {
        console.log('Received data:', data);
        try {
            const newMessage = await patientController.sendMessage(data);
            const room = `${data.patientId}-${data.doctorId}`;
            io.to(room).emit('receiveChatMessage', newMessage);
        }
        catch (error) {
            console.error('Error processing chat message:', error);
            socket.emit('chatError', { error: 'Failed to send message. Please try again.' });
        }
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        console.log(`Active clients: ${io.engine.clientsCount}`);
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);
});
export { io };
