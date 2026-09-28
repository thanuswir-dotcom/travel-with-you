export const getHealth = (req, res) => {
  res.json({
    status: 'ok',
    app: 'Travel With You Backend API',
    tagline: 'Discover more. Spend less. Make memories.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
