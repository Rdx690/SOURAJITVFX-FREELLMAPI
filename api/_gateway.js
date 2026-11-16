function getGateway(req) {
  const raw = String(req.headers['x-gateway-url'] || '').trim();
  const auth = String(req.headers.authorization || '');
  let parsed;
  try { parsed = new URL(raw); } catch { parsed = null; }
  const host = parsed && parsed.hostname.toLowerCase();
  const allowedHost = host === 'openrouter.ai' || (host && host.endsWith('.onrender.com'));
  if (!parsed || parsed.protocol !== 'https:' || !allowedHost || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname.includes('..')) {
    const e = new Error('Use a valid HTTPS OpenRouter or Render gateway URL.'); e.status = 400; throw e;
  }
  if (!auth.startsWith('Bearer ') || auth.length < 12) {
    const e = new Error('Missing API key.'); e.status = 401; throw e;
  }
  // Accept either OpenRouter base URL form: https://openrouter.ai/api or /api/v1.
  // API handlers append /v1/... themselves, so remove a trailing /v1 to avoid /api/v1/v1/... (404).
  const pathname = parsed.pathname.replace(/\/+$/, '').replace(/\/v1$/i, '');
  const url = parsed.origin + pathname;
  return { url, auth };
}
module.exports = { getGateway };
