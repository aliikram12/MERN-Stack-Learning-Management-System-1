import { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import Loader from '../../components/Loader';
import { FiTrash2, FiUsers, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const AdminManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await courseService.getAllCoursesAdmin({ page, limit: 10 });
      setCourses(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
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
        <p>{pagination.total} total courses on the platform</p>
      </div>

      {loading ? (
        <Loader size="small" />
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
              {courses.map((c) => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.instructor?.name || 'N/A'}</td>
                  <td><span className="badge badge-primary">{c.category}</span></td>
                  <td>${c.price}</td>
                  <td>{c.enrollmentCount || 0}</td>
                  <td>{c.lessons?.length || 0}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id, c.title)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button key={page} className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
              onClick={() => fetchCourses(page)}>{page}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageCourses;
