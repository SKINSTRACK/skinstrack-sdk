const fs = require('fs');

const entries = ['index', 'v1/index', 'v2/index'];

for (const entry of entries) {
  const src = `dist/${entry}.d.ts`;
  const dest = `dist/${entry}.d.cts`;
  fs.copyFileSync(src, dest);
  console.log(`copied ${src} → ${dest}`);
}
