import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('🐠 AQUAZONE - PREMIUM AQUATIC STORE');
console.log('====================================================');
console.log('Starting Backend Server (Port 5000)...');
console.log('Starting Fronted Client (Port 5173)...');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = isWindows ? 'node.exe' : 'node';

// Launch Backend
const backend = spawn(nodeCmd, ['index.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Launch Fronted
const fronted = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'fronted'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nShutting down AquaZone servers...');
  backend.kill();
  fronted.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
