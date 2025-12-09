// test-oauth.js
require('dotenv').config();
console.log('GITHUB_ID:', process.env.GITHUB_ID ? '✓ SET' : '✗ MISSING');
console.log('Length:', process.env.GITHUB_ID?.length);
console.log('GITHUB_SECRET:', process.env.GITHUB_SECRET ? '✓ SET' : '✗ MISSING');
console.log('Length:', process.env.GITHUB_SECRET?.length);