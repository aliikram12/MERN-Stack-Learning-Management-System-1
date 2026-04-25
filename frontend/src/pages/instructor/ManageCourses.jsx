import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import Loader from '../../components/Loader';
import { FiEdit, FiTrash2, FiPlus, FiUsers, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await courseService.getInstructorCourses();
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await courseService.deleteCourse(id);
      toast.success('Course deleted');
      setCourses(courses.filter((c) => c._id !== id));
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <Loader text="Loading your courses..." />;

  return (
    <div className="dashboard-page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>My Courses</h1>
          <p>{(courses || []).length} courses created</p>
        </div>
        <Link to="/instructor/create-course" className="btn btn-primary">
          <FiPlus /> New Course
        </Link>
      </div>

      {(courses || []).length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No courses yet</h3>
          <p>Create your first course and start teaching</p>
          <Link to="/instructor/create-course" className="btn btn-primary">
            <FiPlus /> Create Course
          </Link>
        </div>
      ) : (
        <div className="manage-courses-list">
          {courses.map((course, i) => (
            <div key={course._id} className="manage-course-item animate-fadeIn"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="manage-course-img">
                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt={course.title}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'; }} />
              </div>
              <div className="manage-course-info">
                <div className="manage-course-badges">
                  <span className="badge badge-primary">{course.category}</span>
                  <span className={`level-badge ${course.level?.toLowerCase()}`}>{course.level}</span>
                </div>
                <h3>{course.title}</h3>
                <div className="manage-course-meta">
                  <span><FiBookOpen /> {course.lessons?.length || 0} lessons</span>
                  <span><FiUsers /> {course.enrollmentCount || 0} students</span>
                  <span>${course.price}</span>
                </div>
              </div>
              <div className="manage-course-actions">
                <Link to={`/instructor/edit-course/${course._id}`} className="btn btn-secondary btn-sm">
                  <FiEdit /> Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course._id, course.title)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
