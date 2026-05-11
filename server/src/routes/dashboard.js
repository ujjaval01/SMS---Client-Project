import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/summary', async (req, res) => {
  try {
    const [
      students,
      teachers,
      classes,
      announcements,
      activityLogs,
      assignments,
      timetable,
      notes,
      fees,
      users,
      results

    ] = await Promise.all([
      prisma.student.findMany({ include: { user: true, results: true, fees: true, class: true } }),

      prisma.teacher.findMany({ include: { user: true } }),
      prisma.class.findMany({ include: { _count: { select: { students: true } } } }),
      prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.assignment.findMany({ orderBy: { dueDate: 'asc' } }),
      prisma.timetable.findMany(),
      [], // notes (placeholder until Note model added if needed)
      prisma.fee.findMany({ include: { student: true } }),
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.result.findMany()

    ]);

    res.json({
      instituteName: 'Vidya Niketan Institute of Technology, Pune',
      students,
      teachers,
      classes,
      announcements,
      activityLogs,
      assignments,
      schedule: timetable,
      notes,
      fees,
      users,
      results,
      marks: results,

      analytics: {
        monthlyAttendance: [
          { month: 'Jan', pct: 88 },
          { month: 'Feb', pct: 86 },
          { month: 'Mar', pct: 91 },
          { month: 'Apr', pct: 89 },
          { month: 'May', pct: 87 }
        ],
        feeCollection: [
          { month: 'Jan', lakhs: 42 },
          { month: 'Feb', lakhs: 38 },
          { month: 'Mar', lakhs: 51 },
          { month: 'Apr', lakhs: 47 },
          { month: 'May', lakhs: 44 }
        ],
        studentGrowth: [
          { year: '2022', count: 1180 },
          { year: '2023', count: 1245 },
          { year: '2024', count: 1310 },
          { year: '2025', count: 1388 },
          { year: '2026', count: 1452 }
        ]
      },
      studentCount: students.length,
      teacherCount: teachers.length,
      classCount: classes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
