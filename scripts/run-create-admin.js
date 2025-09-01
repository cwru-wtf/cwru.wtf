#!/usr/bin/env tsx

import { execSync } from 'child_process';
import * as path from 'path';

// This script creates the first admin user
// Usage: npm run create-admin

const scriptPath = path.join(process.cwd(), 'scripts', 'create-admin.ts');

try {
  console.log('Creating admin user...');
  execSync(`npx tsx ${scriptPath}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to create admin user:', error);
  process.exit(1);
}
