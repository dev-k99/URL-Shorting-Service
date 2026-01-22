import { useState } from 'react';

function UrlList({ urls, loading, onUpdate, onDelete, onShowStats }) {
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleCopy = async (shortUrl, shortCode) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(shortCode);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEdit = (url) => {
    setEditingId(url.shortCode);
    setEditUrl(url.originalUrl);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditUrl('');
  };

  const handleSaveEdit = async (shortCode) => {
    if (!editUrl.trim()) return;
    
    setUpdating(true);
    const success = await onUpdate(shortCode, editUrl);
    setUpdating(false);
    
    if (success) {
      setEditingId(null);
      setEditUrl('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <span className="spinner"></span>
        Loading URLs...
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
        <h3>No URLs yet</h3>
        <p>Create your first short URL above</p>
      </div>
    );
  }

  return (
    <div>
      <div className="url-list-header">
        <h2>Your URLs</h2>
        <span className="url-count">{urls.length} {urls.length === 1 ? 'link' : 'links'}</span>
      </div>

      <div className="url-list">
        {urls.map((url) => (
          <div key={url.shortCode} className="url-item">
            <div className="url-item-header">
              <div className="url-short">
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                  {url.shortUrl.replace(/^https?:\/\//, '')}
                </a>
                <button
                  className={`copy-btn ${copiedId === url.shortCode ? 'copied' : ''}`}
                  onClick={() => handleCopy(url.shortUrl, url.shortCode)}
                  title="Copy to clipboard"
                >
                  {copiedId === url.shortCode ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  )}
                </button>
              </div>

              <div className="url-actions">
                <button
                  className="btn btn-icon"
                  onClick={() => onShowStats(url.shortCode)}
                  title="View statistics"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 20V10"/>
                    <path d="M12 20V4"/>
                    <path d="M6 20v-6"/>
                  </svg>
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => handleEdit(url)}
                  title="Edit URL"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => onDelete(url.shortCode)}
                  title="Delete URL"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="url-original">
              <svg className="url-original-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              {url.originalUrl}
            </div>

            {editingId === url.shortCode ? (
              <form 
                className="edit-form" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(url.shortCode);
                }}
              >
                <input
                  type="url"
                  className="form-input"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="Enter new URL"
                  required
                  disabled={updating}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={updating}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="url-meta">
                <div className="url-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{formatDate(url.createdAt)}</span>
                </div>
                <div className="url-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span className="access-count">{url.accessCount} {url.accessCount === 1 ? 'click' : 'clicks'}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UrlList;
