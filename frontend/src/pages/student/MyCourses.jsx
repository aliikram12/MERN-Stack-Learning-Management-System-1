import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import enrollmentService from '../../services/enrollmentService';
import Loader from '../../components/Loader';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';
import '../Dashboard.css';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await enrollmentService.getMyCourses();
        setEnrollments(res.data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <Loader text="Loading your courses..." />;

  return (
    <div className="dashboard-page-content">
      <div className="page-header">
        <h1>My Courses</h1>
        <p>Track your learning progress</p>
      </div>

      {(enrollments || []).length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No courses yet</h3>
          <p>Start your learning journey by enrolling in a course</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="enrolled-courses-grid">
          {enrollments.map((enrollment, i) => (
            <div key={enrollment._id} className="enrolled-card animate-fadeIn"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="enrolled-card-img">
                <img
                  src={enrollment.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                  alt={enrollment.course?.title}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'; }}
                />
              </div>
              <div className="enrolled-card-body">
                <span className="badge badge-primary">{enrollment.course?.category}</span>
                <h3>{enrollment.course?.title}</h3>
                <p className="enrolled-instructor">
                  by {enrollment.course?.instructor?.name || 'Instructor'}
                </p>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span className="progress-percent">{enrollment.progress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                </div>

                <div className="enrolled-card-footer">
                  <span className={`badge ${enrollment.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                    {enrollment.status}
                  </span>
                  <Link to={`/courses/${enrollment.course?._id}`} className="btn btn-secondary btn-sm">
                    Continue <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
