"use client"

import { useState, useEffect, FormEvent } from 'react'

interface Experience {
  id: string
  jobTitle: string
  company: string
}

interface Education {
  id: string
  degree: string
  school: string
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
    fetchProfile()
  }, [])

  const addExperience = () => setExperiences([...experiences, { id: Date.now().toString(), jobTitle: '', company: '' }])
  const removeExperience = (id: string) => setExperiences(experiences.filter(exp => exp.id !== id))
  const addEducation = () => setEducation([...education, { id: Date.now().toString(), degree: '', school: '' }])
  const removeEducation = (id: string) => setEducation(education.filter(edu => edu.id !== id))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/resume/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: formData.skillsInput.split(',').map(s => s.trim()).filter(s => s),
          languages: formData.languagesInput.split(',').map(l => l.trim()).filter(l => l),
          workExperience: experiences,
          education: education
        })
      })
      if (res.ok) setMessage({ type: 'success', text: 'Profile Saved Successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-20 text-center text-blue-600 font-bold">Loading Your Profile...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 p-8 rounded-t-xl text-white mb-6 shadow-lg">
        <h1 className="text-3xl font-bold">Resume Builder Profile</h1>
        <p className="opacity-90 text-sm">Fill out your details below to sync with your master resume.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg font-bold text-center border-2 ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. CONTACT INFO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded-lg" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input className="border p-2 rounded-lg" placeholder="Location (City, State)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <input className="border p-2 rounded-lg" placeholder="Website" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
            <input className="border p-2 rounded-lg" placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
            <input className="border p-2 rounded-lg" placeholder="GitHub URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
          </div>
        </div>

        {/* 2. PROFESSIONAL SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Professional Summary</h2>
          <textarea 
            className="border p-3 rounded-lg w-full h-32 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Summarize your professional experience and key achievements..."
            value={formData.professionalSummary} 
            onChange={e => setFormData({...formData, professionalSummary: e.target.value})} 
          />
        </div>

        {/* 3. WORK EXPERIENCE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
            <button type="button" onClick={addExperience} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">+ Add Job</button>
          </div>
          {experiences.length === 0 && <p className="text-gray-400 italic text-center py-4 text-sm">No work experience added yet.</p>}
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="flex flex-col md:flex-row gap-2 mb-4 bg-gray-50 p-3 rounded-lg relative">
              <input className="border p-2 rounded-lg flex-1 bg-white" placeholder="Job Title" value={exp.jobTitle} onChange={e => {
                const newExp = [...experiences]; newExp[idx].jobTitle = e.target.value; setExperiences(newExp);
              }} />
              <input className="border p-2 rounded-lg flex-1 bg-white" placeholder="Company" value={exp.company} onChange={e => {
                const newExp = [...experiences]; newExp[idx].company = e.target.value; setExperiences(newExp);
              }} />
              <button type="button" onClick={() => removeExperience(exp.id)} className="bg-red-50 text-red-500 px-3 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">Delete</button>
            </div>
          ))}
        </div>

        {/* 4. EDUCATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">Education</h2>
            <button type="button" onClick={addEducation} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">+ Add Education</button>
          </div>
          {education.length === 0 && <p className="text-gray-400 italic text-center py-4 text-sm">No education added yet.</p>}
          {education.map((edu, idx) => (
            <div key={edu.id} className="flex flex-col md:flex-row gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
              <input className="border p-2 rounded-lg flex-1 bg-white" placeholder="Degree/Certification" value={edu.degree} onChange={e => {
                const newEdu = [...education]; newEdu[idx].degree = e.target.value; setEducation(newEdu);
              }} />
              <input className="border p-2 rounded-lg flex-1 bg-white" placeholder="School" value={edu.school} onChange={e => {
                const newEdu = [...education]; newEdu[idx].school = e.target.value; setEducation(newEdu);
              }} />
              <button type="button" onClick={() => removeEducation(edu.id)} className="bg-red-50 text-red-500 px-3 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">Delete</button>
            </div>
          ))}
        </div>

        {/* 5. SKILLS & LANGUAGES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Skills & Languages</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">Additional Skills (Comma-separated)</label>
              <input className="border p-2 rounded-lg w-full" placeholder="Project Management, Python, AWS..." value={formData.skillsInput} onChange={e => setFormData({...formData, skillsInput: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">Languages (Comma-separated)</label>
              <input className="border p-2 rounded-lg w-full" placeholder="English (Native), French (Bilingual)..." value={formData.languagesInput} onChange={e => setFormData({...formData, languagesInput: e.target.value})} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
          {saving ? 'Saving Profile...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  )
}