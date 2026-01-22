function UrlStats({ url, onClose }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>URL Statistics</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{url.accessCount}</div>
              <div className="stat-label">Total Clicks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{url.shortCode}</div>
              <div className="stat-label">Short Code</div>
            </div>
          </div>

          <div className="stats-details">
            <div className="stats-detail-item">
              <span className="stats-detail-label">Short URL</span>
              <span className="stats-detail-value">{url.shortUrl}</span>
            </div>
            <div className="stats-detail-item">
              <span className="stats-detail-label">Original URL</span>
              <span className="stats-detail-value">{url.originalUrl}</span>
            </div>
            <div className="stats-detail-item">
              <span className="stats-detail-label">Created</span>
              <span className="stats-detail-value">{formatDate(url.createdAt)}</span>
            </div>
            <div className="stats-detail-item">
              <span className="stats-detail-label">Last Updated</span>
              <span className="stats-detail-value">{formatDate(url.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlStats;
