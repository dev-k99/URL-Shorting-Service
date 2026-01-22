import { customAlphabet } from 'nanoid';

// Create a custom nanoid with alphanumeric characters only
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

/**
 * Generate a unique short code for URLs
 * @returns {string} A 6-character alphanumeric code
 */
export const generateShortCode = () => {
  return nanoid();
};

export default generateShortCode;
