import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import { FiUser, FiMail, FiEdit3, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateProfile(formData);
      if (res.success) {
        updateUser(res.data);
        toast.success('Profile updated successfully');
        setEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page-content">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account settings</p>
      </div>

      <div className="profile-card animate-fadeIn">
        <div className="profile-header">
          <div className="profile-avatar-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <span className="badge badge-primary">{user?.role}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
            <FiEdit3 /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" value={formData.bio} rows="4"
                placeholder="Tell us about yourself..."
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-detail-item">
              <FiUser className="detail-icon" />
              <div>
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{user?.name}</span>
              </div>
            </div>
            <div className="profile-detail-item">
              <FiMail className="detail-icon" />
              <div>
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email}</span>
              </div>
            </div>
            <div className="profile-detail-item">
              <FiEdit3 className="detail-icon" />
              <div>
                <span className="detail-label">Bio</span>
                <span className="detail-value">{user?.bio || 'No bio added yet'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
