import './StatsCard.css';

const StatsCard = ({ icon, label, value, color = 'primary', delay = 0 }) => {
  return (
    <div
      className={`stats-card glass-card animate-fadeIn`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`stats-icon ${color}`}>{icon}</div>
      <div className="stats-info">
        <span className="stats-value">{value}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );
};

export default StatsCard;
