// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(`💥 Error handling ${req.method} ${req.originalUrl}:`, err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    status,
    timestamp: new Date().toISOString()
  });
};
