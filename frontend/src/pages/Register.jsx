import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, role);
      if (res.success) {
        toast.success('Account created successfully!');
        switch (res.data.role) {
          case 'instructor': navigate('/instructor/courses'); break;
          default: navigate('/student/my-courses');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fadeIn">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-icon">🎓</span>
            <h1>Create Account</h1>
            <p>Join EduVerse and start your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="register-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input type="text" name="name" className="form-input" placeholder="John Doe"
                  value={formData.name} onChange={handleChange} id="register-name" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input type="email" name="email" className="form-input" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange} id="register-email" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">I want to</label>
              <div className="role-selector">
                <button type="button" className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'student' })}>
                  🎒 Learn (Student)
                </button>
                <button type="button" className={`role-btn ${formData.role === 'instructor' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'instructor' })}>
                  📚 Teach (Instructor)
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="password" className="form-input"
                  placeholder="At least 6 characters" value={formData.password} onChange={handleChange} id="register-password" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input type="password" name="confirmPassword" className="form-input"
                  placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} id="register-confirm" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="register-submit">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
