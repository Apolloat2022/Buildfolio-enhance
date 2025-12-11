import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
  },
  project: {
    marginBottom: 15,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  projectMeta: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    marginBottom: 8,
  },
  techBadge: {
    backgroundColor: '#eff6ff',
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 8,
  },
  stats: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
})

interface ResumeData {
  user: {
    name: string | null
    email: string | null
  }
  completedProjects: Array<{
    id: string
    title: string
    description: string | null
    technologies: string[]
    completedAt: Date
    difficulty: string
    timeEstimate: string | null
  }>
  stats: {
    totalProjects: number
    totalHours: number
    technologiesLearned: string[]
  }
}

export const ResumePDF = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.user.name || 'Developer Portfolio'}</Text>
        <Text style={styles.contact}>{data.user.email}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statsRow}>
          <Text>Completed Projects:</Text>
          <Text>{data.stats.totalProjects}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text>Development Time:</Text>
          <Text>{data.stats.totalHours} hours</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portfolio Projects</Text>
        {data.completedProjects.map((project, index) => (
          <View key={project.id} style={styles.project}>
            <Text style={styles.projectTitle}>
              {index + 1}. {project.title}
            </Text>
            <Text style={styles.projectMeta}>
              {project.difficulty} • {project.timeEstimate || 'Self-paced'}
            </Text>
            <Text style={styles.description}>
              {project.description || 'Full-stack application'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <Text>{data.stats.technologiesLearned.join(', ')}</Text>
      </View>
    </Page>
  </Document>
)

export default ResumePDF
