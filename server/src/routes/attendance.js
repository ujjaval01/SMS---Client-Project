import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, authorize } from '../middleware/auth.js';
import { emitEvent } from '../utils/socket.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get attendance for a student
router.get('/:studentId', protect, async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: req.params.studentId },
      orderBy: { date: 'desc' }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark attendance (TEACHER & ADMIN)
router.post('/mark', protect, authorize('TEACHER', 'ADMIN'), async (req, res) => {
  try {
    const { studentId, status, date } = req.body;
    
    // 1. Create the daily record
    const record = await prisma.attendance.create({
      data: {
        studentId,
        status,
        date: new Date(date)
      }
    });

    // 2. Update the student's aggregate attendance percentage (Mock calculation for now)
    // In a real app, you'd calculate this from all records
    await prisma.student.update({
      where: { id: studentId },
      data: { attendancePct: { increment: status === 'Present' ? 1 : -1 } }
    });

    emitEvent('attendance_updated', { studentId, status });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
