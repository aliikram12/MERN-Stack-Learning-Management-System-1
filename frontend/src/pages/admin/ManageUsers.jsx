import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Loader from '../../components/Loader';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await userService.getUsers(params);

      // Validate response structure
      if (res && res.success !== false) {
        setUsers(res.data || []);
        setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
      } else {
        throw new Error(res?.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error.message || 'Failed to load users. Please try again.');
      setUsers([]);
      setPagination({ page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1); }, [roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await userService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const roleColors = { admin: 'error', instructor: 'warning', student: 'info' };

  return (
    <div className="dashboard-page-content">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>{pagination?.total || 0} total users</p>
      </div>

      <div className="toolbar animate-fadeIn">
        <div className="search-bar" style={{ maxWidth: '320px' }}>
          <FiSearch className="search-icon" />
          <input type="text" className="search-input" placeholder="Search users..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select filter-select" style={{ minWidth: '140px' }}
          value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <Loader size="small" />
      ) : error ? (
        <div className="empty-state animate-fadeIn">
          <div className="empty-state-icon">❌</div>
          <h3>Error Loading Users</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => fetchUsers(1)}>
            Try Again
          </button>
        </div>
      ) : (users?.length || 0) === 0 ? (
        <div className="empty-state animate-fadeIn">
          <div className="empty-state-icon">👥</div>
          <h3>No users found</h3>
          <p>No users match your current search or filters.</p>
        </div>
      ) : (
        <div className="table-container animate-fadeIn">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u) => (
                <tr key={u?._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                        {u?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      {u?.name || 'Unknown User'}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{u?.email || 'N/A'}</td>
                  <td><span className={`badge badge-${roleColors[u?.role] || 'info'}`}>{u?.role || 'unknown'}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u?._id, u?.name)}>
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
              onClick={() => fetchUsers(page)}>{page}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
