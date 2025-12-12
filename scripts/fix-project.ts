import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function fixProject() {
  // Delete all existing
  await prisma.step.deleteMany()
  await prisma.projectTemplate.deleteMany()
  
  console.log('✅ Cleared existing data')
  
  // Re-create with proper slug
  const project = await prisma.projectTemplate.create({
    data: {
      slug: 'ecommerce-store',
      title: 'Build an E-commerce Store',
      description: 'Create a full-stack e-commerce platform with product listings, shopping cart, and checkout functionality.',
      difficulty: 'intermediate',
      timeEstimate: '25-30 hours',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
      resumeImpact: 5,
      category: 'Full-Stack'
    }
  })
  
  console.log('✅ Created project with slug:', project.slug)
  console.log('Project ID:', project.id)
}

fixProject()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
