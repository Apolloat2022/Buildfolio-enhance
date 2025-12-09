// test_url.js - SIMPLE URL VALIDATION
console.log('Testing database URL...');

// REPLACE THIS WITH YOUR ACTUAL DATABASE URL
const databaseUrl = "postgresql://neondb_owner:npg_1AimyerUEJK@ep-snowy-feather-admm952h.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";


try {
  console.log('URL to test:', databaseUrl.replace(/:[^:@]*@/, ':*****@'));
  
  // Test if URL is valid
  const url = new URL(databaseUrl);
  
  console.log('\n✅ URL IS VALID');
  console.log('Protocol:', url.protocol);
  console.log('Hostname:', url.hostname);
  console.log('Port:', url.port || '5432 (default)');
  console.log('Database:', url.pathname.replace('/', ''));
  console.log('Username:', url.username);
  
} catch (error) {
  console.log('\n❌ INVALID URL:', error.message);
  console.log('\nCommon issues:');
  console.log('1. Missing "postgresql://" at start');
  console.log('2. @ symbol in password not encoded as %2540');
  console.log('3. Missing port (:5432) after hostname');
  console.log('4. Special characters not properly encoded');
}