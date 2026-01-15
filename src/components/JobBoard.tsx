import { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  useEffect(() => {
    if (!user) return

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
  }, [user])

  const fetchJobs = async () => {
    if (!user) return

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
  }

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
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={handleDeleteJob}
              onStatusChange={handleUpdateStatus}
              onEdit={setEditingJob}
            />
          ))}
        </div>
      )}
    </div>
  )
}
