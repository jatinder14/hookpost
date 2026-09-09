// tsc only emits JS, so the node's icon has to be copied into dist by hand or
// n8n renders the node without one.
const fs = require('fs');
const path = require('path');
const from = path.join(__dirname, 'nodes', 'Hookpost', 'hookpost.svg');
const toDir = path.join(__dirname, 'dist', 'nodes', 'Hookpost');
fs.mkdirSync(toDir, { recursive: true });
fs.copyFileSync(from, path.join(toDir, 'hookpost.svg'));
console.log('copied icon -> dist/nodes/Hookpost/hookpost.svg');
