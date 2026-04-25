import './Loader.css';

const Loader = ({ variant = 'default', text = '' }) => {
  return (
    <div className={`loader-container ${variant !== 'default' ? `loader-${variant}` : ''}`} id="loading-spinner">
      <div className="loader-spinner">
        {variant !== 'small' && (
          <>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </>
        )}
        <span className="spinner-icon">{variant === 'small' ? '⏳' : '🎓'}</span>
      </div>
      {text && variant !== 'small' && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
