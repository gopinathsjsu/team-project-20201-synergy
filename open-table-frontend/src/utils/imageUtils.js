import axios from "axios";

// Simple in-memory cache to prevent duplicate API calls during a session
const urlCache = new Map();
const CACHE_EXPIRY = 60 * 60 * 1000; // 60 minutes
// Use fallback only when there's an error, not by default
const LOCAL_PLACEHOLDER = "/restaurant-image.svg";

/**
 * Fetches presigned URLs for a batch of image keys
 * @param {string[]} imageKeys - Array of S3 image keys to fetch
 * @returns {Object} - Map of image keys to presigned URLs
 */
export async function getPresignedUrls(imageKeys = []) {
  if (!imageKeys || !imageKeys.length) return {};
  
  try {
    // Check cache first for all keys
    const now = Date.now();
    const cachedResults = {};
    const keysToFetch = [];
    
    // Normalize all keys first for consistent cache lookups
    const normalizedImageKeys = imageKeys.map(key => {
      if (!key || typeof key !== 'string') return null;
      return key.startsWith('/') ? key.substring(1) : key;
    }).filter(Boolean);
    
    // Check cache for all keys
    normalizedImageKeys.forEach(normalizedKey => {
      if (!normalizedKey) return;
      
      // Try both the normalized key and with leading slash
      const cacheEntry = urlCache.get(normalizedKey) || urlCache.get('/' + normalizedKey);
      
      if (cacheEntry && cacheEntry.expires > now) {
        cachedResults[normalizedKey] = cacheEntry.url;
      } else {
        keysToFetch.push(normalizedKey);
      }
    });
    
    // If all keys are cached, return immediately
    if (keysToFetch.length === 0) {
      console.log("All URLs found in cache, returning cached URLs");
      return mapResultsBackToOriginalKeys(cachedResults, imageKeys);
    }
    
    // IMPORTANT: Deduplicate keys to avoid server errors
    // Some components may request the same key multiple times
    const uniqueKeysToFetch = [...new Set(keysToFetch)];
    console.log(`Deduplicating keys: ${keysToFetch.length} keys reduced to ${uniqueKeysToFetch.length} unique keys`);
    
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("Fetching presigned URLs for:", uniqueKeysToFetch);
    
    try {
      const response = await axios.post(
        `${API_BASE}/api/s3/presigned-url/batch`,
        uniqueKeysToFetch,
        { 
          withCredentials: true,
          timeout: 8000, // 8 second timeout to prevent long hangs
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response?.data?.data) {
        // Process the new URLs and add to cache
        Object.entries(response.data.data).forEach(([key, url]) => {
          if (!url) return; // Skip null/undefined URLs
          
          // Normalize the key from the response
          const normalizedKey = key.startsWith('/') ? key.substring(1) : key;
          
          // Add to cache with both variants (with and without leading slash)
          urlCache.set(normalizedKey, { url, expires: now + CACHE_EXPIRY });
          urlCache.set('/' + normalizedKey, { url, expires: now + CACHE_EXPIRY });
          
          cachedResults[normalizedKey] = url;
        });
        
        // Map back to original keys and return
        return mapResultsBackToOriginalKeys(cachedResults, imageKeys);
      }
      
      return mapResultsBackToOriginalKeys(cachedResults, imageKeys);
    } catch (apiError) {
      // Enhanced error logging
      console.error("⚠️ API error fetching presigned URLs:");
      console.error("  Status:", apiError.response?.status);
      console.error("  Status Text:", apiError.response?.statusText);
      console.error("  URL:", `${API_BASE}/api/s3/presigned-url/batch`);
      console.error("  Request payload:", uniqueKeysToFetch);
      
      if (apiError.response) {
        console.error("  Response data:", apiError.response.data);
      }
      
      // Return cached results as fallback
      return mapResultsBackToOriginalKeys(cachedResults, imageKeys);
    }
  } catch (error) {
    console.error("Unexpected error in getPresignedUrls:", error);
    return {}; // Return empty object in case of unexpected errors
  }
}

/**
 * Maps the normalized cached results back to the original keys format
 */
function mapResultsBackToOriginalKeys(cachedResults, originalKeys) {
  const result = {};
  
  originalKeys.forEach(originalKey => {
    if (!originalKey || typeof originalKey !== 'string') return;
    
    const normalizedKey = originalKey.startsWith('/') ? originalKey.substring(1) : originalKey;
    
    if (cachedResults[normalizedKey]) {
      result[originalKey] = cachedResults[normalizedKey];
    }
  });
  
  return result;
} 