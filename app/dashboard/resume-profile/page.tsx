// app/dashboard/resume-profile/page.tsx
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

  // Form state
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

  // Load profile on page load
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

        if (data.workExperience && Array.isArray(data.workExperience)) {
          setExperiences(data.workExperience)
        }

        if (data.education && Array.isArray(data.education)) {
          setEducation(data.education)
        }
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
    setMessage(null)

    try {
      const dataToSend = {
        phone: formData.phone,
        location: formData.location,
        website: formData.website,
        linkedin: formData.linkedin,
        github: formData.github,
        professionalSummary: formData.professionalSummary,
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

      const result = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile saved successfully!' })
        setTimeout(() => fetchProfile(), 1000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Save failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }])
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      degree: '',
      school: '',
      graduationYear: '',
      description: ''
    }])
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Resume Profile</h1>
      <p className="text-gray-600 mb-8">Complete your profile to generate a comprehensive resume</p>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (City, State)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
          <textarea
            name="professionalSummary"
            value={formData.professionalSummary}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Brief overview of your professional background and goals..."
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Experience
            </button>
          </div>

          {experiences.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No work experience added yet.</p>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-700">Experience #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Software Engineer"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company*</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Tech Corp"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={fetchProfile}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Resume Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}