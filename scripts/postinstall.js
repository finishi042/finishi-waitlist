#!/usr/bin/env node

// Only install Linux binary on Linux platforms
if (process.platform === 'linux') {
  const { execSync } = require('child_process');
  const { version } = require('../node_modules/lightningcss/package.json');
  
  console.log(`Installing lightningcss-linux-x64-gnu@${version} for Linux platform...`);
  
  try {
    execSync(`npm install --no-save --force lightningcss-linux-x64-gnu@${version}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('Successfully installed Linux binary for lightningcss');
  } catch (error) {
    console.error('Failed to install lightningcss Linux binary:', error.message);
    process.exit(1);
  }
} else {
  console.log(`Skipping lightningcss Linux binary installation on ${process.platform}`);
}
