// scripts/check-project-fields.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 CHECKING PROJECT VISUAL FIELDS");
  
  // Get first project to see all its fields
  const project = await prisma.projectTemplate.findFirst({
    select: {
      id: true,
      title: true,
      slug: true,
      icon: true,        // Check if this field exists
      iconColor: true,   // Check if this field exists
      gradientFrom: true,
      gradientTo: true,
      emoji: true,       // Check for emoji field
      technologies: true
    }
  });
  
  console.log("Project fields:", Object.keys(project));
  console.log("\nCurrent values:");
  console.log("Icon:", project.icon);
  console.log("Emoji:", project.emoji);
  console.log("Colors:", project.iconColor, project.gradientFrom, project.gradientTo);
  
  // Check your schema for icon-related fields
  const schema = require('fs').readFileSync('prisma/schema.prisma', 'utf8');
  const projectSchema = schema.match(/model ProjectTemplate \{[\s\S]+?\n\}/);
  
  if (projectSchema) {
    console.log("\n📋 ProjectTemplate schema fields:");
    const fields = projectSchema[0].match(/\s+\w+.+/g);
    fields.forEach(f => console.log(f.trim()));
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
