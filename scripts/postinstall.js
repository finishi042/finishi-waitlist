#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only install Linux binary on Linux platforms
if (process.platform === 'linux') {
  const pkgPath = join(__dirname, '../node_modules/lightningcss/package.json');
  const { version } = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  
  console.log(`Installing lightningcss-linux-x64-gnu@${version} for Linux platform...`);
  
  try {
    execSync(`npm install --no-save --force lightningcss-linux-x64-gnu@${version}`, {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
    console.log('Successfully installed Linux binary for lightningcss');
  } catch (error) {
    console.error('Failed to install lightningcss Linux binary:', error.message);
    process.exit(1);
  }
} else {
  console.log(`Skipping lightningcss Linux binary installation on ${process.platform}`);
}
