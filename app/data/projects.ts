// app/data/projects.ts
export type Project = {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tech: string[];
  timeEstimate: string;
  resumeScore: number;
};

export const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Build a full-stack online store with cart, payment gateway, and admin dashboard.',
    difficulty: 'Intermediate',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    timeEstimate: '40-60 hours',
    resumeScore: 5,
  },
  {
    id: 2,
    title: 'Social Media App',
    description: 'Create a Twitter-like platform with real-time messaging and user feeds.',
    difficulty: 'Advanced',
    tech: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
    timeEstimate: '60-80 hours',
    resumeScore: 5,
  },
  {
    id: 3,
    title: 'Job Portal',
    description: 'Build a job board with filters, applications, and company profiles.',
    difficulty: 'Intermediate',
    tech: ['Vue.js', 'Python', 'Django', 'MySQL'],
    timeEstimate: '30-50 hours',
    resumeScore: 4,
  },
  {
    id: 4,
    title: 'Resume Builder',
    description: 'Interactive tool to create and export professional resumes with templates.',
    difficulty: 'Beginner',
    tech: ['HTML', 'CSS', 'JavaScript', 'PDF.js'],
    timeEstimate: '20-30 hours',
    resumeScore: 3,
  },
  {
    id: 5,
    title: 'Healthcare App',
    description: 'Doctor appointment system with patient records and notifications.',
    difficulty: 'Intermediate',
    tech: ['Angular', 'TypeScript', 'Firebase', 'Chart.js'],
    timeEstimate: '50-70 hours',
    resumeScore: 4,
  },
  {
    id: 6,
    title: 'Task Manager Pro',
    description: 'Advanced task manager with teams, deadlines, and progress tracking.',
    difficulty: 'Intermediate',
    tech: ['React', 'Redux', 'Node.js', 'MongoDB'],
    timeEstimate: '30-40 hours',
    resumeScore: 3,
  },
  {
    id: 7,
    title: 'Real Estate Listings',
    description: 'Property search platform with maps, filters, and virtual tours.',
    difficulty: 'Advanced',
    tech: ['Next.js', 'Mapbox', 'PostgreSQL', 'Tailwind'],
    timeEstimate: '50-60 hours',
    resumeScore: 4,
  },
  {
    id: 8,
    title: 'Food Delivery Service',
    description: 'Full-stack delivery app with real-time order tracking.',
    difficulty: 'Intermediate',
    tech: ['React Native', 'Node.js', 'MongoDB', 'WebSockets'],
    timeEstimate: '60-80 hours',
    resumeScore: 5,
  },
  {
    id: 9,
    title: 'Fitness Tracker',
    description: 'Workout logging app with progress charts and social features.',
    difficulty: 'Beginner',
    tech: ['JavaScript', 'Chart.js', 'LocalStorage', 'CSS'],
    timeEstimate: '20-35 hours',
    resumeScore: 3,
  },
  {
    id: 10,
    title: 'Crypto Dashboard',
    description: 'Track cryptocurrency prices with portfolio management.',
    difficulty: 'Advanced',
    tech: ['React', 'API Integration', 'Chart.js', 'Firebase'],
    timeEstimate: '40-55 hours',
    resumeScore: 4,
  },
];