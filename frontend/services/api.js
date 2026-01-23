const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  /**
   * Create a new short URL
   */
  async createShortUrl(url) {
    try {
      const response = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create short URL');
      }

      return await response.json();
    } catch (error) {
      console.error('Create short URL error:', error);
      throw error;
    }
  }

  /**
   * Get all URLs
   */
  async getAllUrls() {
    try {
      const response = await fetch(`${API_URL}/api/urls`);

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all URLs error:', error);
      throw error;
    }
  }

  /**
   * Get URL by short code
   */
  async getUrlByShortCode(shortCode) {
    try {
      const response = await fetch(`${API_URL}/api/urls/${shortCode}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Short URL not found');
        }
        throw new Error('Failed to fetch URL');
      }

      return await response.json();
    } catch (error) {
      console.error('Get URL error:', error);
      throw error;
    }
  }

  /**
   * Update URL
   */
  async updateUrl(shortCode, newUrl) {
    try {
      const response = await fetch(`${API_URL}/api/urls/${shortCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update URL');
      }

      return await response.json();
    } catch (error) {
      console.error('Update URL error:', error);
      throw error;
    }
  }

  /**
   * Delete URL
   */
  async deleteUrl(shortCode) {
    try {
      const response = await fetch(`${API_URL}/api/urls/${shortCode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete URL error:', error);
      throw error;
    }
  }

  /**
   * Get URL statistics
   */
  async getUrlStats(shortCode) {
    try {
      const response = await fetch(`${API_URL}/api/urls/${shortCode}/stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }
}

export default new ApiService();