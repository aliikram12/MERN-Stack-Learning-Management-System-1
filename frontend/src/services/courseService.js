import API from './api';

/**
 * Course service — handles all course-related API calls
 */
const courseService = {
  // Public
  getCourses: async (params = {}) => {
    const response = await API.get('/courses', { params });
    return response.data;
  },

  getCourse: async (id) => {
    const response = await API.get(`/courses/${id}`);
    return response.data;
  },

  // Instructor
  createCourse: async (courseData) => {
    const response = await API.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await API.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await API.delete(`/courses/${id}`);
    return response.data;
  },

  getInstructorCourses: async () => {
    const response = await API.get('/courses/instructor/me');
    return response.data;
  },

  // Lessons
  addLesson: async (courseId, lessonData) => {
    const response = await API.post(`/courses/${courseId}/lessons`, lessonData);
    return response.data;
  },

  deleteLesson: async (courseId, lessonId) => {
    const response = await API.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  // Admin
  getAllCoursesAdmin: async (params = {}) => {
    const response = await API.get('/courses/admin/all', { params });
    return response.data;
  },

  // File Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default courseService;
