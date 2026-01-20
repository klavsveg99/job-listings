import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { AddJobForm } from './AddJobForm'
import { JobCard } from './JobCard'
import './JobBoard.css'

interface Job {
  id: string
  title: string
  company: string
  status: string
  url?: string
  notes?: string
  created_at: string
}

export const JobBoard = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['all']))

  const statuses = ['saved', 'applied', 'interview stage', 'rejected', 'offer']

  const statusColors: Record<string, string> = {
    'saved': '#6366f1',
    'applied': '#3b82f6',
    'interview stage': '#f59e0b',
    'rejected': '#ef4444',
    'offer': '#10b981'
  }

  const isAllSelected = selectedStatuses.has('all')

  const fetchJobs = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
    } else {
      setJobs(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!user) return

    // Initial fetch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('jobs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchJobs()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, fetchJobs])

  const handleDeleteJob = async (jobId: string) => {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId)
    if (error) {
      console.error('Error deleting job:', error)
    } else {
      setJobs(jobs.filter((job) => job.id !== jobId))
    }
  }

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId)

    if (error) {
      console.error('Error updating job:', error)
    } else {
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
    }
  }

  const filteredJobs = isAllSelected ? jobs : jobs.filter(job => selectedStatuses.has(job.status))

  return (
    <div className="job-board">
      <AddJobForm onJobAdded={fetchJobs} editingJob={editingJob} onEditComplete={() => setEditingJob(null)} />

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs yet. Add your first job to get started!</p>
        </div>
      ) : (
        <>
          <div className="status-filters">
            <button className={isAllSelected ? 'active' : ''} onClick={() => setSelectedStatuses(new Set(['all']))}>All</button>
            {statuses.map(status => (
              <button
                key={status}
                className={`${selectedStatuses.has(status) ? 'active' : ''} ${isAllSelected ? 'disabled' : ''}`}
                style={selectedStatuses.has(status) ? { backgroundColor: statusColors[status], color: '#ffffff', borderColor: statusColors[status] } : {}}
                onClick={() => {
                  if (isAllSelected) {
                    setSelectedStatuses(new Set([status]))
                  } else {
                    const newSet = new Set(selectedStatuses)
                    if (newSet.has(status)) {
                      newSet.delete(status)
                      if (newSet.size === 0) newSet.add('all')
                    } else {
                      newSet.add(status)
                      newSet.delete('all')
                    }
                    setSelectedStatuses(newSet)
                  }
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={handleDeleteJob}
                onStatusChange={handleUpdateStatus}
                onEdit={setEditingJob}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
