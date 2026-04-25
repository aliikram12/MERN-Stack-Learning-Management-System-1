import API from './api';

/**
 * Enrollment service — handles enrollment and progress API calls
 */
const enrollmentService = {
  enroll: async (courseId) => {
    const response = await API.post('/enroll', { courseId });
    return response.data;
  },

  getMyCourses: async () => {
    const response = await API.get('/enroll/my-courses');
    return response.data;
  },

  updateProgress: async (enrollmentId, progressData) => {
    const response = await API.put(`/enroll/${enrollmentId}/progress`, progressData);
    return response.data;
  },

  checkEnrollment: async (courseId) => {
    const response = await API.get(`/enroll/check/${courseId}`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await API.get('/enroll/analytics');
    return response.data;
  },

  getPendingEnrollments: async () => {
    const response = await API.get('/enroll/pending');
    return response.data;
  },

  updateEnrollmentStatus: async (enrollmentId, status) => {
    const response = await API.put(`/enroll/${enrollmentId}/status`, { status });
    return response.data;
  },
};

export default enrollmentService;
