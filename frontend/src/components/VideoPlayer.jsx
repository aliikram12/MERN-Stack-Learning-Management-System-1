import React from 'react';
import { FiX } from 'react-icons/fi';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, title, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <h3>{title}</h3>
          <button className="video-close-btn" onClick={onClose} aria-label="Close video">
            <FiX />
          </button>
        </div>
        <div className="video-viewport">
          {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video controls controlsList="nodownload" autoPlay>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper to extract YouTube ID
function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default VideoPlayer;
