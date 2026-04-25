import { useState, useEffect } from 'react';
import enrollmentService from '../../services/enrollmentService';
import Loader from '../../components/Loader';
import { FiCheck, FiX, FiClock, FiBook, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PendingApprovals = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await enrollmentService.getPendingEnrollments();
      setEnrollments(res.data);
    } catch (error) {
      toast.error('Failed to load pending enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);
    try {
      await enrollmentService.updateEnrollmentStatus(id, status);
      toast.success(`Enrollment ${status} successfully`);
      setEnrollments(enrollments.filter(e => e._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loader text="Fetching pending requests..." />;

  return (
    <div className="dashboard-page-content animate-fadeIn">
      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800 }}>Enrollment Requests</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review and approve student course access</p>
      </div>

      <div className="approvals-grid" style={{ display: 'grid', gap: 'var(--space-6)' }}>
        {enrollments.length > 0 ? (
          enrollments.map((enrollment) => (
            <div key={enrollment._id} className="request-card glass-card" style={{ 
              padding: 'var(--space-6)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div className="student-info" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div className="student-avatar" style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-light)', 
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}>
                  {enrollment.student?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700 }}>{enrollment.student?.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{enrollment.student?.email}</p>
                </div>
              </div>

              <div className="course-info" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <FiBook style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600 }}>{enrollment.course?.title}</span>
              </div>

              <div className="request-actions" style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button 
                  className="btn btn-success" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleStatusUpdate(enrollment._id, 'approved')}
                  disabled={processing === enrollment._id}
                >
                  <FiCheck /> Approve
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleStatusUpdate(enrollment._id, 'rejected')}
                  disabled={processing === enrollment._id}
                >
                  <FiX /> Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ 
            padding: 'var(--space-16)', 
            textAlign: 'center', 
            background: '#ffffff', 
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed #cbd5e1'
          }}>
            <FiClock style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: 'var(--space-4)' }} />
            <h3>No Pending Requests</h3>
            <p>You're all caught up! New requests will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;
