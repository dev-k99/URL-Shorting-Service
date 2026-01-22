import express from 'express';
import {
  createShortUrl,
  getAllUrls,
  getUrlByShortCode,
  updateUrl,
  deleteUrl,
  getUrlStats
} from '../controllers/urlController.js';

const router = express.Router();

// Create a new short URL
router.post('/shorten', createShortUrl);

// Get all URLs
router.get('/urls', getAllUrls);

// Get a specific URL by short code
router.get('/urls/:shortCode', getUrlByShortCode);

// Update an existing URL
router.put('/urls/:shortCode', updateUrl);

// Delete a URL
router.delete('/urls/:shortCode', deleteUrl);

// Get statistics for a URL
router.get('/urls/:shortCode/stats', getUrlStats);

export default router;
