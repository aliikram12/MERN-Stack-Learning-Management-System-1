import { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import Loader from '../../components/Loader';
import { FiTrash2, FiUsers, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const AdminManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getAllCoursesAdmin({ page, limit: 10 });

      // Validate response structure
      if (res && res.success !== false) {
        setCourses(res.data || []);
        setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
      } else {
        throw new Error(res?.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError(error.message || 'Failed to load courses. Please try again.');
      setCourses([]);
      setPagination({ page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(1); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete course "${title}"?`)) return;
    try {
      await courseService.deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses(pagination.page);
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="dashboard-page-content">
      <div className="page-header">
        <h1>All Courses</h1>
        <p>{pagination?.total || 0} total courses on the platform</p>
      </div>

      {loading ? (
        <Loader size="small" />
      ) : error ? (
        <div className="empty-state animate-fadeIn">
          <div className="empty-state-icon">❌</div>
          <h3>Error Loading Courses</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => fetchCourses(1)}>
            Try Again
          </button>
        </div>
      ) : (courses?.length || 0) === 0 ? (
        <div className="empty-state animate-fadeIn">
          <div className="empty-state-icon">📚</div>
          <h3>No courses found</h3>
          <p>No courses are available on the platform yet.</p>
        </div>
      ) : (
        <div className="table-container animate-fadeIn">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Students</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(courses || []).map((c) => (
                <tr key={c?._id}>
                  <td><strong>{c?.title || 'Untitled'}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{c?.instructor?.name || 'N/A'}</td>
                  <td><span className="badge badge-primary">{c?.category || 'Uncategorized'}</span></td>
                  <td>${c?.price || 0}</td>
                  <td>{c?.enrollmentCount || 0}</td>
                  <td>{c?.lessons?.length || 0}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c?._id, c?.title)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(pagination?.pages || 1) > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination?.pages || 1 }, (_, i) => i + 1).map((page) => (
            <button key={page} className={`pagination-btn ${(pagination?.page || 1) === page ? 'active' : ''}`}
              onClick={() => fetchCourses(page)}>{page}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageCourses;
