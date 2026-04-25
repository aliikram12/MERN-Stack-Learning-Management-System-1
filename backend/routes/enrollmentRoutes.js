const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
  updateProgress,
  checkEnrollment,
  getAnalytics,
  getPendingEnrollments,
  updateEnrollmentStatus,
  approveEnrollment,
  rejectEnrollment,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

// Student routes
router.post('/', protect, authorize('student'), enrollCourse);
router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.put('/:id/progress', protect, authorize('student'), updateProgress);
router.get('/check/:courseId', protect, checkEnrollment);

// Admin routes
router.get('/analytics', protect, authorize('admin'), getAnalytics);

// Instructor and Admin routes for Enrollment Approval
router.get('/pending', protect, authorize('admin', 'instructor'), getPendingEnrollments);
router.put('/:id/status', protect, authorize('admin', 'instructor'), updateEnrollmentStatus);
router.put('/:id/approve', protect, authorize('admin', 'instructor'), approveEnrollment);
router.put('/:id/reject', protect, authorize('admin', 'instructor'), rejectEnrollment);

module.exports = router;
