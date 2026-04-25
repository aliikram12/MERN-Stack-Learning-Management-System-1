const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
  getInstructorCourses,
  getAllCoursesAdmin,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// IMPORTANT: Static routes MUST come before parameterized routes (/:id)

// Instructor dashboard — must be before /:id
router.get('/instructor/me', protect, authorize('instructor'), getInstructorCourses);

// Admin dashboard — must be before /:id
router.get('/admin/all', protect, authorize('admin'), getAllCoursesAdmin);

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Instructor routes
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// Lesson management (Instructor)
router.post('/:id/lessons', protect, authorize('instructor'), addLesson);
router.delete('/:id/lessons/:lessonId', protect, authorize('instructor'), deleteLesson);

module.exports = router;
