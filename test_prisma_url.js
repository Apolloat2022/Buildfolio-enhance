// test_prisma_url.js
const databaseUrl = "postgresql://neondb_owner:npg_1AimyerUEJK0@ep-snowy-feather-admm952h.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

console.log('Testing URL for Prisma compatibility...\n');

try {
  const url = new URL(databaseUrl);
  
  console.log('✅ URL Components:');
  console.log(`   Protocol: ${url.protocol}`);
  console.log(`   Username: ${url.username}`);
  console.log(`   Password: ${url.password ? '***' + url.password.slice(-3) : 'None'}`);
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432 (default)'}`);
  console.log(`   Database: ${url.pathname.replace('/', '')}`);
  console.log(`   SSL Mode: ${url.searchParams.get('sslmode')}`);
  
  // Check for problematic parameters
  if (url.searchParams.has('channel_binding')) {
    console.log('\n⚠️  WARNING: channel_binding parameter detected');
    console.log('   Prisma may not handle this well. Remove it from URL.');
  }
  
  console.log('\n📋 Copy this to your .env file:');
  console.log(`DATABASE_URL="${databaseUrl}"`);
  
} catch (error) {
  console.log('❌ Error:', error.message);
}