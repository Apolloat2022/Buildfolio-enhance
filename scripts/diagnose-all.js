// scripts/diagnose-all.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 UNIVERSAL DIAGNOSTIC');
  console.log('======================');
  
  // 1. List ALL tables and their record counts
  console.log('\n📊 DATABASE OVERVIEW:');
  const tables = await prisma.$queryRaw`
    SELECT table_name, 
           (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
    FROM information_schema.tables t
    LEFT JOIN LATERAL (
      SELECT table_schema, table_name, 
             query_to_xml(format('SELECT count(*) as cnt FROM %I.%I', 
                                table_schema, table_name), 
                         false, true, '') as xml_count
    ) c ON t.table_schema = c.table_schema AND t.table_name = c.table_name
    WHERE t.table_schema = 'public'
    ORDER BY table_name
  `;
  
  tables.forEach(t => {
    console.log(`  ${t.table_name}: ${t.row_count || 0} records`);
  });
  
  // 2. Check specific critical tables
  console.log('\n🎯 CRITICAL TABLES CHECK:');
  
  // Check User table
  const users = await prisma.user.findMany({ take: 3 });
  console.log(`Users: ${users.length} total (showing ${Math.min(3, users.length)})`);
  users.forEach((u, i) => {
    console.log(`  ${i+1}. ${u.email || 'No email'} (ID: ${u.id})`);
  });
  
  // Check ProjectTemplate table
  const projects = await prisma.projectTemplate.findMany({ take: 3 });
  console.log(`\nProjectTemplates: ${projects.length} total`);
  projects.forEach(p => {
    console.log(`  - ${p.slug}: ${p.title}`);
  });
  
  // Check Step table
  const steps = await prisma.step.findMany({ 
    where: { projectTemplate: { slug: 'ecommerce-store' } },
    orderBy: { order: 'asc' },
    take: 3 
  });
  console.log(`\nE-commerce Steps: ${steps.length} found`);
  steps.forEach(s => {
    console.log(`  Step ${s.order}: ${s.title} (ID: ${s.id})`);
  });
  
  // 3. Check Progress Tracking
  console.log('\n📈 PROGRESS TRACKING:');
  
  // Check StartedProject table
  const startedProjects = await prisma.startedProject.findMany({ 
    include: { projectTemplate: true },
    take: 5 
  });
  console.log(`StartedProjects: ${startedProjects.length} records`);
  startedProjects.forEach(sp => {
    console.log(`  - User ${sp.userId}: ${sp.projectTemplate?.title || 'Unknown'} - ${sp.progress}%`);
  });
  
  // Check StepCompletion table (if it exists by a different name)
  console.log('\n🔄 STEP COMPLETION CHECK:');
  try {
    const completions = await prisma.stepCompletion.findMany({ take: 3 });
    console.log(`StepCompletion records: ${completions.length}`);
  } catch (e) {
    console.log('❌ StepCompletion table might not exist or have different name');
    console.log('Error:', e.message);
    
    // Try to find completion table
    console.log('\n🔍 Searching for completion-like tables...');
    const allTables = tables.map(t => t.table_name.toLowerCase());
    const completionTables = allTables.filter(name => 
      name.includes('complet') || name.includes('progress') || name.includes('step')
    );
    if (completionTables.length > 0) {
      console.log('Possible completion tables:', completionTables);
    }
  }
  
  // 4. Check Certificate Eligibility
  console.log('\n🏆 CERTIFICATE STATUS:');
  const eligibleProjects = await prisma.startedProject.findMany({
    where: { certificateEligible: true },
    include: { projectTemplate: true }
  });
  console.log(`Projects with certificate eligibility: ${eligibleProjects.length}`);
  eligibleProjects.forEach(sp => {
    console.log(`  ✅ ${sp.projectTemplate?.title || 'Unknown'} - User: ${sp.userId}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
