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
    console.error('GET Assignments Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create assignment (ADMIN & TEACHER)
router.post('/', protect, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const { title, dueDate, classId } = req.body;
    
    console.log('Attempting to create assignment:', { title, dueDate, classId, user: req.user.email });

    if (!title || !dueDate || !classId) {
       return res.status(400).json({ message: 'Missing required fields: title, dueDate, or classId' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        classId
      },
      include: { class: true }
    });

    console.log('Assignment created successfully:', assignment.id);

    emitEvent('assignment_created', assignment);
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'New Assignment',
        actor: req.user.name || 'Teacher',
        role: req.user.role,
        details: `Assigned: ${title} to Class ID: ${classId}`
      }
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('POST Assignment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
