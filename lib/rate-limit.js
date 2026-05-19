import { LRUCache } from 'lru-cache';

export default function rateLimit(options) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000, // default 1 min
  });

  return {
    check: (limit, token) =>
      new Promise((resolve, reject) => {
        let sanitizedToken = token;
        if (typeof token === 'string' && token.includes(',')) {
          sanitizedToken = token.split(',')[0].trim();
        }

        const tokenCount = tokenCache.get(sanitizedToken) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(sanitizedToken, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        
        if (isRateLimited) {
          return reject(new Error('Rate limit exceeded'));
        }
        
        return resolve(currentUsage);
      }),
  };
}
