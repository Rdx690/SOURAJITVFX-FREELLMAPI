function getGateway(req) {
  const url = String(req.headers['x-gateway-url'] || '').trim().replace(/\/+$/, '');
  const auth = String(req.headers.authorization || '');
  if (!url || !/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(url)) {
    const e = new Error('A valid HTTPS FreeLLMAPI URL is required.'); e.status = 400; throw e;
  }
  if (!auth.startsWith('Bearer ') || auth.length < 12) {
    const e = new Error('Missing unified API key.'); e.status = 401; throw e;
  }
  return { url, auth };
}
module.exports = { getGateway };
