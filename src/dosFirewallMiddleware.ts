import { Request, Response, NextFunction } from 'express';
import * as memoryCache from 'memory-cache';
import { IP_BLOCK_THRESHOLD } from './config';

export function dosProtectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIP = req.ip;

  if (!clientIP) {
    next();
    return;
  }

  let heat: number = memoryCache.get(clientIP) || 0;
  const blacklisted: string[] = memoryCache.get('blacklisted') || [];

  if (blacklisted && blacklisted.includes(clientIP)) {
    res.status(429).json({ error: 'Too many requests. Your IP is blocked.' });
    return;
  }

  if (heat >= IP_BLOCK_THRESHOLD) {
    const arr = [ ...blacklisted, clientIP];
    memoryCache.put('blacklisted', arr);

    memoryCache.del(clientIP);

    console.log('\x1b[31m%s\x1b[0m', `IP ${clientIP} is blocked now.`)
    res.status(429).json({ error: 'Too many requests. Your IP is blocked.' });
    return;
  }

  heat++;

  memoryCache.put(clientIP, heat);

  console.log('\x1b[31m%s\x1b[0m', `IP ${clientIP} has heated up to ${heat} now.`);

  next();
}
