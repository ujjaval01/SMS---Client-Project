import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import dashboardRoutes from './routes/dashboard.js';
import classRoutes from './routes/classes.js';
import resultRoutes from './routes/results.js';
import announcementRoutes from './routes/announcements.js';
import attendanceRoutes from './routes/attendance.js';
import feeRoutes from './routes/fees.js';
import assignmentRoutes from './routes/assignments.js';




import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { initSocket } from './utils/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

initSocket(io);


const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// Check DB Connection
async function checkDb() {
  try {
    const count = await prisma.user.count();
    console.log(`Connected to DB. Total users in database: ${count}`);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}
checkDb();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/assignments', assignmentRoutes);





app.get('/', (req, res) => {
  res.send('SMS Real-time API is running...');
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

