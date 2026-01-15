import { useState } from 'react'
import './JobCard.css'

interface Job {
  id: string
  title: string
  company: string
  status: string
  url?: string
  notes?: string
  created_at: string
}

interface JobCardProps {
  job: Job
  onDelete: (jobId: string) => void
  onStatusChange: (jobId: string, newStatus: string) => void
  onEdit: (job: Job) => void
}

const statuses = ['saved', 'applied', 'interview stage', 'rejected', 'offer']

export const JobCard = ({ job, onDelete, onStatusChange, onEdit }: JobCardProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      saved: '#6366f1',
      applied: '#3b82f6',
      'interview stage': '#f59e0b',
      rejected: '#ef4444',
      offer: '#10b981',
    }
    return colors[status] || '#6366f1'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="job-card" onClick={() => onEdit(job)} style={{ cursor: 'pointer' }}>
      <div className="job-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('Are you sure you want to delete this job?')) {
              onDelete(job.id)
            }
          }}
          title="Delete job"
        >
          ✕
        </button>
      </div>

      <div className="job-status">
        {isEditing ? (
          <select
            value={job.status}
            onChange={(e) => {
              onStatusChange(job.id, e.target.value)
              setIsEditing(false)
            }}
            className="status-select"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <button
            className="status-badge"
            style={{ backgroundColor: getStatusColor(job.status) }}
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            title="Click to change status"
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </button>
        )}
      </div>

      {job.url && (
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="job-url">
          View Job Posting →
        </a>
      )}

      {job.notes && (
        <div className="job-notes">
          <strong>Notes:</strong>
          <p>{job.notes}</p>
        </div>
      )}

      <div className="job-footer">
        <span className="job-date">Added {formatDate(job.created_at)}</span>
      </div>
    </div>
  )
}
