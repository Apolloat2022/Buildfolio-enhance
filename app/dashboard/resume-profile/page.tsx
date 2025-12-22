"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from 'react'

interface Experience {
  id: string
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  degree: string
  school: string
  graduationYear: string
  description: string
}

export default function ResumeProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    professionalSummary: '',
    skillsInput: '',
    languagesInput: ''
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/resume/profile')
      const data = await res.json()
      if (res.ok && data) {
        setFormData({
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          professionalSummary: data.professionalSummary || '',
          skillsInput: Array.isArray(data.skills) ? data.skills.join(', ') : '',
          languagesInput: Array.isArray(data.languages) ? data.languages.join(', ') : ''
        })
        setExperiences(data.workExperience || [])
        setEducation(data.education || [])
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const dataToSend = {
        ...formData,
        skills: formData.skillsInput.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languagesInput.split(',').map(l => l.trim()).filter(l => l),
        workExperience: experiences,
        education: education
      }
      const res = await fetch('/api/resume/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      if (res.ok) setMessage({ type: 'success', text: 'Profile saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  // Dynamic Handlers
  const addExperience = () => setExperiences([...experiences, { id: Date.now().toString(), jobTitle: '', company: '', startDate: '', endDate: '', current: false, description: '' }])
  const addEducation = () => setEducation([...education, { id: Date.now().toString(), degree: '', school: '', graduationYear: '', description: '' }])

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Resume Profile</h1>
      <p className="text-gray-600 mb-8">Complete your profile to generate a comprehensive resume</p>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CONTACT SECTION */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="border p-2 rounded" />
            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="border p-2 rounded" />
            <input type="url" placeholder="LinkedIn URL" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="border p-2 rounded" />
            <input type="url" placeholder="GitHub URL" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} className="border p-2 rounded" />
          </div>
        </div>

        {/* WORK EXPERIENCE SECTION */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <button type="button" onClick={addExperience} className="text-blue-600 font-medium">+ Add Experience</button>
          </div>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="border-b pb-4 mb-4 last:border-0">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Job Title" value={exp.jobTitle} onChange={(e) => {
                  const newExp = [...experiences]; newExp[idx].jobTitle = e.target.value; setExperiences(newExp);
                }} className="border p-2 rounded" />
                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => {
                  const newExp = [...experiences]; newExp[idx].company = e.target.value; setExperiences(newExp);
                }} className="border p-2 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* EDUCATION SECTION */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
            <button type="button" onClick={addEducation} className="text-blue-600 font-medium">+ Add Education</button>
          </div>
          {education.map((edu, idx) => (
            <div key={edu.id} className="border-b pb-4 mb-4 last:border-0">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => {
                  const newEdu = [...education]; newEdu[idx].degree = e.target.value; setEducation(newEdu);
                }} className="border p-2 rounded" />
                <input type="text" placeholder="School" value={edu.school} onChange={(e) => {
                  const newEdu = [...education]; newEdu[idx].school = e.target.value; setEducation(newEdu);
                }} className="border p-2 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* SKILLS & LANGUAGES */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <input type="text" placeholder="React, Node.js, TypeScript..." value={formData.skillsInput} onChange={(e) => setFormData({...formData, skillsInput: e.target.value})} className="border p-2 rounded w-full mb-4" />
          
          <h2 className="text-xl font-semibold mb-2">Languages</h2>
          <input type="text" placeholder="English (Native), Spanish (Fluent)..." value={formData.languagesInput} onChange={(e) => setFormData({...formData, languagesInput: e.target.value})} className="border p-2 rounded w-full" />
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={fetchProfile} className="px-6 py-2 border rounded">Reset</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Resume Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}