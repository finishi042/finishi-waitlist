import type { VercelRequest, VercelResponse } from '@vercel/node';
import { router } from '../app/router.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Build the full URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = new URL(req.url || '/', `${protocol}://${host}`);

    // Build headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : String(value));
      }
    }

    // Build the request
    const init: RequestInit = {
      method: req.method,
      headers,
    };

    // Add body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const request = new Request(url.toString(), init);

    // Get response from router
    const response = await router.fetch(request);

    // Set status
    res.status(response.status);

    // Set headers
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    // Send body
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).send('Internal Server Error');
  }
}
