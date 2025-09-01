const { execSync } = require('child_process');

try {
  console.log('Running database migration...');
  execSync('npx tsx scripts/migrate-database.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
