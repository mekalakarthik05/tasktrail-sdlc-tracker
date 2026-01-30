const expectedKey = process.env.API_KEY || 'dev-api-key';

function withApiKey(handler) {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required. Send X-API-Key header.' });
    }
    if (apiKey !== expectedKey) {
      return res.status(403).json({ error: 'Invalid API key.' });
    }
    return handler(req, res);
  };
}

module.exports = withApiKey;
