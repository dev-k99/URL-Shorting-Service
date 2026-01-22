import pool from '../db/index.js';
import generateShortCode from '../utils/shortCodeGenerator.js';

/**
 * Create a new short URL
 */
export const createShortUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate unique short code
    let shortCode = generateShortCode();
    
    // Ensure uniqueness (retry if collision)
    let attempts = 0;
    while (attempts < 5) {
      const existing = await pool.query(
        'SELECT id FROM urls WHERE short_code = $1',
        [shortCode]
      );
      if (existing.rows.length === 0) break;
      shortCode = generateShortCode();
      attempts++;
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO urls (short_code, original_url) 
       VALUES ($1, $2) 
       RETURNING id, short_code, original_url, created_at, access_count`,
      [shortCode, url]
    );

    const newUrl = result.rows[0];
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

    res.status(201).json({
      id: newUrl.id,
      shortCode: newUrl.short_code,
      shortUrl: `${baseUrl}/${newUrl.short_code}`,
      originalUrl: newUrl.original_url,
      createdAt: newUrl.created_at,
      accessCount: newUrl.access_count
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all URLs
 */
export const getAllUrls = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, short_code, original_url, created_at, updated_at, access_count FROM urls ORDER BY created_at DESC'
    );

    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

    const urls = result.rows.map(row => ({
      id: row.id,
      shortCode: row.short_code,
      shortUrl: `${baseUrl}/${row.short_code}`,
      originalUrl: row.original_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      accessCount: row.access_count
    }));

    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get a specific URL by short code
 */
export const getUrlByShortCode = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      'SELECT id, short_code, original_url, created_at, updated_at, access_count FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const row = result.rows[0];
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

    res.json({
      id: row.id,
      shortCode: row.short_code,
      shortUrl: `${baseUrl}/${row.short_code}`,
      originalUrl: row.original_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      accessCount: row.access_count
    });
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update an existing short URL
 */
export const updateUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const result = await pool.query(
      `UPDATE urls 
       SET original_url = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE short_code = $2 
       RETURNING id, short_code, original_url, created_at, updated_at, access_count`,
      [url, shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const row = result.rows[0];
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

    res.json({
      id: row.id,
      shortCode: row.short_code,
      shortUrl: `${baseUrl}/${row.short_code}`,
      originalUrl: row.original_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      accessCount: row.access_count
    });
  } catch (error) {
    console.error('Error updating URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete a short URL
 */
export const deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      'DELETE FROM urls WHERE short_code = $1 RETURNING id',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get statistics for a short URL
 */
export const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      'SELECT id, short_code, original_url, created_at, updated_at, access_count FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const row = result.rows[0];
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

    res.json({
      shortCode: row.short_code,
      shortUrl: `${baseUrl}/${row.short_code}`,
      originalUrl: row.original_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      accessCount: row.access_count,
      stats: {
        totalClicks: row.access_count,
        createdAt: row.created_at,
        lastUpdated: row.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching URL stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Redirect to original URL and increment access count
 */
export const redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Get URL and increment access count in one query
    const result = await pool.query(
      `UPDATE urls 
       SET access_count = access_count + 1 
       WHERE short_code = $1 
       RETURNING original_url`,
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(301, result.rows[0].original_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
