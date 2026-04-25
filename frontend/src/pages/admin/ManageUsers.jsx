import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Loader from '../../components/Loader';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await userService.getUsers(params);
      setUsers(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
        <p>{pagination.total} total users</p>
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
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><span className={`badge badge-${roleColors[u.role]}`}>{u.role}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)}>
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
              onClick={() => fetchUsers(page)}>{page}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
