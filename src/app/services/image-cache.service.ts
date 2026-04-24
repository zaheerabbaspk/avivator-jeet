import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {

  constructor() { }

  /**
   * Retrieves a cached base64 image from localStorage if available.
   * If not, returns the original URL and fetches/caches it in the background.
   */
  async getCachedImage(url: string): Promise<string> {
    if (!url) return '';
    if (url.startsWith('assets/') || url.startsWith('data:')) {
      return url; 
    }

    const cacheKey = 'img_cache_' + url;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      return cached;
    }

    // Trigger background caching
    this.cacheImage(url, cacheKey);

    // Return original url for immediate rendering while caching happens
    return url;
  }

  private async cacheImage(url: string, cacheKey: string) {
    try {
      // Attempt to fetch the image. Might fail if the server doesn't allow CORS.
      const response = await fetch(url);
      if (!response.ok) return;

      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64data = reader.result as string;
        try {
          localStorage.setItem(cacheKey, base64data);
        } catch (e) {
          // LocalStorage might be full (quota exceeded)
          console.warn('LocalStorage quota exceeded. Clearing old image cache...');
          this.clearCache();
          try {
            localStorage.setItem(cacheKey, base64data);
          } catch (e2) {
            console.error('Still unable to cache image after clearing.');
          }
        }
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.warn('Could not cache image (possibly due to CORS). Browser native cache will be used instead.', url);
    }
  }

  clearCache() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('img_cache_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}
