import { useState, useEffect, useCallback } from 'react';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';
import UrlStats from './components/UrlStats';

const API_BASE = '/api';

function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Fetch all URLs
  const fetchUrls = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/urls`);
      if (!response.ok) throw new Error('Failed to fetch URLs');
      const data = await response.json();
      setUrls(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showToast('Failed to fetch URLs', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Create new URL
  const handleCreate = async (url) => {
    try {
      const response = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create short URL');
      }

      const newUrl = await response.json();
      setUrls(prev => [newUrl, ...prev]);
      showToast('Short URL created successfully!');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Update URL
  const handleUpdate = async (shortCode, newUrl) => {
    try {
      const response = await fetch(`${API_BASE}/urls/${shortCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update URL');
      }

      const updatedUrl = await response.json();
      setUrls(prev => prev.map(u => u.shortCode === shortCode ? updatedUrl : u));
      showToast('URL updated successfully!');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Delete URL
  const handleDelete = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE}/urls/${shortCode}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete URL');
      }

      setUrls(prev => prev.filter(u => u.shortCode !== shortCode));
      showToast('URL deleted successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Fetch stats for a URL
  const handleShowStats = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE}/urls/${shortCode}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setSelectedUrl(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>URL Shortener</h1>
          <p>Create short, memorable links in seconds</p>
        </header>

        <UrlForm onSubmit={handleCreate} />

        <UrlList
          urls={urls}
          loading={loading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onShowStats={handleShowStats}
        />

        {selectedUrl && (
          <UrlStats
            url={selectedUrl}
            onClose={() => setSelectedUrl(null)}
          />
        )}

        {/* Toast Notifications */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span className="toast-icon">
                {toast.type === 'success' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                )}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
