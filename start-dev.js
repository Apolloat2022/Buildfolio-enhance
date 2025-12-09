// start-dev.js - Windows compatible
require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
const args = ['dev'];

spawn(process.execPath, [nextBin, ...args], {
  stdio: 'inherit',
  shell: true
});