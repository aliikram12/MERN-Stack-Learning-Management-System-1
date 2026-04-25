import { useState, useEffect } from 'react';
import API from '../services/api';
import { FiBell, FiMail } from 'react-icons/fi';
import './NotificationMenu.css';

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-wrapper">
      <button className="notification-trigger" onClick={() => setShow(!show)}>
        <FiBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {show && (
        <>
          <div className="notification-overlay" onClick={() => setShow(false)} />
          <div className="notification-dropdown glass-card animate-fadeIn">
            <div className="notification-header">
              <h4>Notifications</h4>
              {unreadCount > 0 && <span>{unreadCount} new</span>}
            </div>
            <div className="notification-list">
              {(notifications || []).length === 0 ? (
                <div className="notification-empty">No notifications yet</div>
              ) : (
                notifications.map(n => (
                  <div key={n._id} 
                    className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                    onClick={() => markAsRead(n._id)}
                  >
                    <div className="notification-icon">
                      <FiMail />
                    </div>
                    <div className="notification-body">
                      <p>{n.message}</p>
                      <span className="notification-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    {!n.isRead && <div className="unread-dot" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationMenu;
