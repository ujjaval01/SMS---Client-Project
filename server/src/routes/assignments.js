import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, authorize } from '../middleware/auth.js';
import { emitEvent } from '../utils/socket.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all assignments
router.get('/', protect, async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: { class: true },
      orderBy: { dueDate: 'asc' }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create assignment (ADMIN & TEACHER)
router.post('/', protect, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const { title, dueDate, classId } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        classId
      }
    });

    emitEvent('assignment_created', assignment);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
