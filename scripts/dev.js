// Unified development runner for Travel With You
// Launches both Backend API Server and Frontend Client with color-coded logging
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting Travel With You Full-Stack Environment...\n');

// 1. Launch Backend Server (Port 5000)
const server = spawn('node', ['index.js'], {
  cwd: path.join(rootDir, 'server'),
  stdio: 'pipe',
  shell: true
});

server.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[36m[SERVER]\x1b[0m ${line}`));
});

server.stderr.on('data', (data) => {
  console.error(`\x1b[31m[SERVER ERROR]\x1b[0m ${data.toString().trim()}`);
});

// 2. Launch Frontend Client (Port 5173)
const client = spawn('npm', ['run', 'dev', '--', '--host'], {
  cwd: path.join(rootDir, 'frontend'),
  stdio: 'pipe',
  shell: true
});

client.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[32m[CLIENT]\x1b[0m ${line}`));
});

client.stderr.on('data', (data) => {
  console.error(`\x1b[33m[CLIENT WARN]\x1b[0m ${data.toString().trim()}`);
});

function shutdown() {
  console.log('\n🛑 Shutting down Travel With You services...');
  server.kill();
  client.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
