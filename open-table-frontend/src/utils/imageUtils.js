import axios from "axios";

// Simple in-memory cache to prevent duplicate API calls during a session
const urlCache = new Map();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

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
    
    imageKeys.forEach(key => {
      if (!key) return;
      
      const cacheEntry = urlCache.get(key);
      if (cacheEntry && cacheEntry.expires > now) {
        cachedResults[key] = cacheEntry.url;
      } else {
        keysToFetch.push(key);
      }
    });
    
    // If all keys are cached, return immediately
    if (keysToFetch.length === 0) {
      console.log("All URLs found in cache, returning cached URLs");
      return cachedResults;
    }
    
    // IMPORTANT: Deduplicate keys to avoid server errors
    // Some components may request the same key multiple times
    const uniqueKeysToFetch = [...new Set(keysToFetch)];
    console.log(`Deduplicating keys: ${keysToFetch.length} keys reduced to ${uniqueKeysToFetch.length} unique keys`);
    
    // Normalize keys by removing any leading slash
    const normalizedKeys = uniqueKeysToFetch.map(key => {
      // Safety check for non-string keys
      if (typeof key !== 'string') {
        console.warn(`Non-string key passed to getPresignedUrls:`, key);
        return null;
      }
      return key.startsWith('/') ? key.substring(1) : key;
    }).filter(Boolean);
    
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("Fetching presigned URLs for:", uniqueKeysToFetch);
    
    try {
      const response = await axios.post(
        `${API_BASE}/api/s3/presigned-url/batch`,
        normalizedKeys,
        { 
          withCredentials: true,
          timeout: 8000, // 8 second timeout to prevent long hangs
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response?.data?.data) {
        // Create a map to match original keys to normalized keys
        const keyMap = {};
        uniqueKeysToFetch.forEach((originalKey, index) => {
          if (typeof originalKey === 'string') {
            const normalizedKey = normalizedKeys[index];
            if (normalizedKey) {
              keyMap[normalizedKey] = originalKey;
            }
          }
        });
        
        // Map the response back to the original keys
        const mappedUrls = { ...cachedResults }; // Start with cached results
        
        Object.entries(response.data.data).forEach(([key, url]) => {
          if (!url) return; // Skip null/undefined URLs
          
          // Add CORS parameters to URL if not already present
          const corsUrl = url;
          
          // Try to find a match for the key
          let originalKey = key;
          
          // Try to find an exact match first
          if (keyMap[key]) {
            originalKey = keyMap[key];
          } else {
            // Try to find a match by ignoring leading slashes
            const normalizedResponseKey = key.startsWith('/') ? key.substring(1) : key;
            for (const k of Object.keys(keyMap)) {
              const origKey = keyMap[k];
              if (origKey === key || origKey === '/' + key || 
                  k === normalizedResponseKey || '/' + k === key) {
                originalKey = origKey;
                break;
              }
            }
          }
          
          // Add to cache and result
          mappedUrls[originalKey] = corsUrl;
          urlCache.set(originalKey, { 
            url: corsUrl, 
            expires: now + CACHE_EXPIRY 
          });
          
          // Make sure we handle the duplicate keys by also applying this URL
          // to any other identical keys in the original request
          keysToFetch.forEach(duplicateKey => {
            if (duplicateKey === originalKey || 
                (duplicateKey.startsWith('/') && duplicateKey.substring(1) === originalKey) ||
                ('/' + duplicateKey === originalKey)) {
              mappedUrls[duplicateKey] = corsUrl;
              urlCache.set(duplicateKey, {
                url: corsUrl,
                expires: now + CACHE_EXPIRY
              });
            }
          });
        });
        
        return mappedUrls;
      }
      
      return cachedResults; // Return cached results if the API didn't return anything useful
    } catch (apiError) {
      // Enhanced error logging
      console.error("⚠️ API error fetching presigned URLs:");
      console.error("  Status:", apiError.response?.status);
      console.error("  Status Text:", apiError.response?.statusText);
      console.error("  URL:", `${API_BASE}/api/s3/presigned-url/batch`);
      console.error("  Request payload:", normalizedKeys);
      
      if (apiError.response) {
        console.error("  Response data:", apiError.response.data);
        console.error("  Response headers:", apiError.response.headers);
      }
      
      if (apiError.request) {
        console.error("  Request info:", {
          method: apiError.config?.method,
          timeout: apiError.config?.timeout
        });
      }
      
      console.error("  Full error:", apiError);
      
      // Return cached results as fallback
      return cachedResults;
    }
  } catch (error) {
    console.error("Unexpected error in getPresignedUrls:", error);
    return {}; // Return empty object in case of unexpected errors
  }
} 