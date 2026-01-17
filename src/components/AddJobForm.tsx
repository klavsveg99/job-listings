import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import './AddJobForm.css'

interface Job {
  id: string
  title: string
  company: string
  status: string
  url?: string
  notes?: string
  created_at: string
}

interface AddJobFormProps {
  onJobAdded: () => void
  editingJob?: Job | null
  onEditComplete?: () => void
}

export const AddJobForm = ({ onJobAdded, editingJob, onEditComplete }: AddJobFormProps) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    status: 'saved',
    url: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const statuses = ['saved', 'applied', 'interview stage', 'rejected', 'offer']

  // When editing job changes, populate the form and show modal
  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title,
        company: editingJob.company,
        status: editingJob.status,
        url: editingJob.url || '',
        notes: editingJob.notes || '',
      })
      setShowModal(true)
      setShowForm(false)
    }
  }, [editingJob])

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false)
        onEditComplete?.()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [showModal, onEditComplete])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      let error
      
      if (editingJob) {
        // Update existing job
        const { error: updateError } = await supabase
          .from('jobs')
          .update({
            title: formData.title,
            company: formData.company,
            status: formData.status,
            url: formData.url || null,
            notes: formData.notes || null,
          })
          .eq('id', editingJob.id)
        
        error = updateError
      } else {
        // Create new job
        const { error: insertError } = await supabase.from('jobs').insert([
          {
            user_id: user.id,
            title: formData.title,
            company: formData.company,
            status: formData.status,
            url: formData.url || null,
            notes: formData.notes || null,
          },
        ])
        
        error = insertError
      }

      if (error) {
        console.error('Insert/Update error:', error)
        throw new Error(error.message || 'Failed to save job. Check that the database is set up.')
      }

      setFormData({
        title: '',
        company: '',
        status: 'saved',
        url: '',
        notes: '',
      })
      setShowForm(false)
      setShowModal(false)
      onJobAdded()
      onEditComplete?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      console.error('Full error:', err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    onEditComplete?.()
  }

  const formContent = (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Job Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Senior React Developer"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="company">Company *</label>
        <input
          id="company"
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g., TechCorp Inc"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="url">Job URL</label>
        <input
          id="url"
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com/jobs/123"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes about this job..."
          rows={4}
        />
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Saving...' : editingJob ? 'Save Changes' : 'Add Job'}
        </button>
        <button 
          type="button" 
          onClick={() => {
            setShowForm(false)
            handleCloseModal()
          }} 
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </form>
  )

  if (editingJob && showModal) {
    return (
      <div className="form-modal-overlay active" onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseModal()
      }}>
        <div className="form-modal-content">
          {formContent}
        </div>
      </div>
    )
  }

  if (showForm && !editingJob) {
    return (
      <>
        {formContent}
      </>
    )
  }

  return (
    <button className="add-job-button" onClick={() => setShowForm(true)}>
      + Add New Job
    </button>
  )
}
