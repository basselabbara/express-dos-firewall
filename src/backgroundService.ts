import * as memoryCache from 'memory-cache';
import { COOL_DOWN_INTERVAL } from './config';

function coolDownIPs() {
  memoryCache.keys().forEach((key) => {
    const heat = memoryCache.get(key);
    if(typeof heat === 'number') {
      if (heat > 0) {
        memoryCache.put(key, Math.max(heat - 1, 0));

        console.log('\x1b[32m%s\x1b[0m', `IP ${key} has cooled down to ${heat} now.`);

      } else if (heat === 0) {
        memoryCache.del(key);

        console.log('\x1b[32m%s\x1b[0m', `IP ${key} has been removed from the cache.`);
      }
    }
  });
}

setInterval(coolDownIPs, COOL_DOWN_INTERVAL);
