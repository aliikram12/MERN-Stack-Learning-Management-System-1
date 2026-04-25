const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

/**
 * @desc    Enroll in a course
 * @route   POST /api/enroll
 * @access  Student
 */
const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Create enrollment with pending status
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      status: 'pending',
    });

    // Notify Instructor
    const Notification = require('../models/Notification');
    await Notification.create({
      recipient: course.instructor,
      sender: req.user._id,
      type: 'enrollment_request',
      message: `${req.user.name} has requested to enroll in your course: ${course.title}`,
      relatedId: enrollment._id,
    });

    // Populate course data before sending response
    await enrollment.populate('course', 'title thumbnail instructor category');

    res.status(201).json({
      success: true,
      data: enrollment,
      message: 'Enrollment request sent. Waiting for instructor approval.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get enrolled courses for current student
 * @route   GET /api/my-courses
 * @access  Student
 */
const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name avatar',
        },
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update enrollment progress
 * @route   PUT /api/enroll/:id/progress
 * @access  Student
 */
const updateProgress = async (req, res, next) => {
  try {
    const { progress, completedLessonId } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Verify the student owns this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment',
      });
    }

    // Update progress
    if (progress !== undefined) {
      enrollment.progress = Math.min(Math.max(progress, 0), 100);
    }

    // Add completed lesson if provided
    if (completedLessonId) {
      if (!enrollment.completedLessons.includes(completedLessonId)) {
        enrollment.completedLessons.push(completedLessonId);
      }
    }

    // Mark as completed if progress hits 100
    if (enrollment.progress >= 100) {
      enrollment.status = 'completed';
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if student is enrolled in a course
 * @route   GET /api/enroll/check/:courseId
 * @access  Student
 */
const checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get analytics data (Admin)
 * @route   GET /api/enroll/analytics
 * @access  Admin
 */
const getAnalytics = async (req, res, next) => {
  try {
    const User = require('../models/User');

    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEnrollments = await Enrollment.countDocuments({
      enrolledAt: { $gte: thirtyDaysAgo },
    });

    // Category distribution
    const categoryDistribution = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        recentEnrollments,
        categoryDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending enrollments (Admin/Instructor)
 * @route   GET /api/enroll/pending
 * @access  Admin, Instructor
 */
const getPendingEnrollments = async (req, res, next) => {
  try {
    console.log('👤 USER:', req.user._id, 'ROLE:', req.user.role);
    console.log('🔍 FETCHING PENDING ENROLLMENTS');

    let enrollments;

    if (req.user.role === 'admin') {
      // Admins see everything
      enrollments = await Enrollment.find({ status: 'pending' })
        .populate('student', 'name email avatar')
        .populate('course', 'title thumbnail');
    } else {
      // Instructors see only their courses
      enrollments = await Enrollment.find({ status: 'pending' })
        .populate({
          path: 'course',
          match: { instructor: req.user._id },
          select: 'title thumbnail instructor',
        })
        .populate('student', 'name email avatar');

      // Filter out enrollments that don't match the instructor (where course is null due to match)
      enrollments = enrollments.filter((e) => e.course !== null);
    }

    console.log(`✅ FOUND ${enrollments.length} PENDING REQUESTS`);
    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error('❌ PENDING FETCH ERROR:', error);
    next(error);
  }
};

/**
 * @desc    Update enrollment status (Approve/Reject)
 * @route   PUT /api/enroll/:id/status
 * @access  Admin, Instructor
 */
const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status update',
      });
    }

    const enrollment = await Enrollment.findById(req.params.id).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Role check: Instructor can only approve their own courses
    if (req.user.role === 'instructor' && enrollment.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment',
      });
    }

    enrollment.status = status;
    await enrollment.save();

    // If approved, increment course enrollment count and add to list
    if (status === 'approved') {
      const course = await Course.findById(enrollment.course._id);
      course.enrollmentCount += 1;
      // Add student to the enrollments array for easier counting/checking
      if (!course.enrollments.includes(enrollment.student)) {
        course.enrollments.push(enrollment.student);
      }
      await course.save();
    }

    // Notify Student
    const Notification = require('../models/Notification');
    await Notification.create({
      recipient: enrollment.student,
      sender: req.user._id,
      type: status === 'approved' ? 'enrollment_approved' : 'enrollment_rejected',
      message: status === 'approved' 
        ? `Congratulations! Your enrollment for ${enrollment.course.title} has been approved.` 
        : `Sorry, your enrollment for ${enrollment.course.title} was not approved.`,
      relatedId: enrollment.course._id,
    });

    res.status(200).json({
      success: true,
      data: enrollment,
      message: `Enrollment ${status} successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve enrollment (Shortcut)
 * @route   PUT /api/enroll/:id/approve
 * @access  Admin, Instructor
 */
const approveEnrollment = async (req, res, next) => {
  req.body.status = 'approved';
  updateEnrollmentStatus(req, res, next);
};

/**
 * @desc    Reject enrollment (Shortcut)
 * @route   PUT /api/enroll/:id/reject
 * @access  Admin, Instructor
 */
const rejectEnrollment = async (req, res, next) => {
  req.body.status = 'rejected';
  updateEnrollmentStatus(req, res, next);
};

module.exports = {
  enrollCourse,
  getMyCourses,
  updateProgress,
  checkEnrollment,
  getAnalytics,
  getPendingEnrollments,
  updateEnrollmentStatus,
  approveEnrollment,
  rejectEnrollment,
};
