import { useState } from 'react';

function UrlForm({ onSubmit }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    const success = await onSubmit(url);
    setLoading(false);

    if (success) {
      setUrl('');
    }
  };

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="url"
          className="form-input"
          placeholder="Enter your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !url.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Shortening...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Shorten URL
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default UrlForm;
