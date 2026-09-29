import app from './app.js';
import { config } from './config/index.js';
import './services/supabaseService.js';

const HOST = '0.0.0.0';
const server = app.listen(config.port, HOST, () => {
  console.log(`🚀 Travel With You backend server running on http://${HOST}:${config.port}`);
  console.log(`📍 REST APIs available at http://${HOST}:${config.port}/api/`);
  console.log(`🌍 Environment: ${config.env}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default server;
