import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from 'react-i18next'
import { Project, Job } from './types'
import { Sidebar } from './components/Sidebar'
import { StatsView } from './components/StatsView'
import { ProjectsView } from './components/ProjectsView'
import './App.css'

function App() {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [note, setNote] = useState('')

  // Navigation State
  const [currentView, setCurrentView] = useState<'main' | 'stats' | 'projects'>('main')

  // UI State for adding project
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    // Sync language to main process
    const syncLanguage = (lang: string) => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('language-changed', lang)
      }
    }

    // Sync usage on mount
    syncLanguage(i18n.language)

    // Listen for changes
    i18n.on('languageChanged', syncLanguage)

    // Cleanup
    const cleanup = () => {
      i18n.off('languageChanged', syncLanguage)
    }

    loadData()

    return cleanup
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeJob && activeJob.isRunning) {
      interval = setInterval(() => {
        const now = Date.now()
        const currentDuration = Math.floor((now - activeJob.startTime) / 1000) + activeJob.duration
        setElapsed(currentDuration)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeJob])

  const loadData = async () => {
    if (!window.db) {
      console.error('Database API not available')
      // No translation for system errors usually needed, or use t() if desired
      alert('Database API (window.db) is missing. Preload script failed to load.')
      return
    }

    try {
      const loadedProjects = await window.db.getProjects()
      const loadedJobs = await window.db.getJobs()
      setProjects(loadedProjects)
      setJobs(loadedJobs)

      // Check for running job
      const running = loadedJobs.find(j => j.isRunning)
      if (running) {
        setActiveJob(running)
        const now = Date.now()
        setElapsed(Math.floor((now - running.startTime) / 1000) + running.duration)
        setNote(running.description)
        setSelectedProjectId(running.projectId)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const startTimer = async () => {
    if (activeJob) return // Already running

    try {
      const newJob: Job = {
        id: uuidv4(),
        projectId: selectedProjectId,
        description: note,
        startTime: Date.now(),
        endTime: null,
        duration: 0,
        isRunning: true
      }

      console.log('Starting timer:', newJob)
      await window.db.addJob(newJob)
      setActiveJob(newJob)
      setJobs(prev => [...prev, newJob])
    } catch (error) {
      console.error('Failed to start timer:', error)
      alert('Failed to start timer. Check console for details.')
    }
  }

  const stopTimer = async () => {
    if (!activeJob) return

    try {
      const now = Date.now()
      const finalDuration = Math.floor((now - activeJob.startTime) / 1000) + activeJob.duration

      const updatedJob: Job = {
        ...activeJob,
        endTime: now,
        duration: finalDuration,
        isRunning: false
      }

      await window.db.updateJob(updatedJob)

      // Update local state
      setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j))
      setActiveJob(null)
      setElapsed(0)
      setNote('')
    } catch (error) {
      console.error('Failed to stop timer:', error)
    }
  }

  const handleAddProject = async (name?: string) => {
    const nameToAdd = name || newProjectName
    if (!nameToAdd.trim()) {
      setIsAddingProject(false)
      return
    }

    try {
      const newProject: Project = {
        id: uuidv4(),
        name: nameToAdd,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
      }
      await window.db.addProject(newProject)
      setProjects(prev => [...prev, newProject])
      setNewProjectName('')
      setIsAddingProject(false)
    } catch (error: any) {
      console.error('Failed to add project:', error)
      alert(`Failed to add project: ${error.message || error}`)
    }
  }

  const handleUpdateProject = async (project: Project) => {
    try {
      await window.db.updateProject(project)
      setProjects(prev => prev.map(p => p.id === project.id ? project : p))
    } catch (error: any) {
      console.error('Failed to update project:', error)
      alert(`Failed to update project: ${error.message || error}`)
    }
  }

  const handleDeleteProject = async (id: string, deleteJobs: boolean) => {
    try {
      await window.db.deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))

      if (deleteJobs) {
        // Delete all jobs associated with this project
        const jobsToDelete = jobs.filter(j => j.projectId === id)
        for (const job of jobsToDelete) {
          await window.db.deleteJob(job.id)
        }
        setJobs(prev => prev.filter(j => j.projectId !== id))
      } else {
        // Update jobs to have no project
        const jobsToUpdate = jobs.filter(j => j.projectId === id)
        for (const job of jobsToUpdate) {
          const updatedJob = { ...job, projectId: null }
          await window.db.updateJob(updatedJob)
        }
        setJobs(prev => prev.map(j => j.projectId === id ? { ...j, projectId: null } : j))
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error)
      alert(`Failed to delete project: ${error.message || error}`)
    }
  }

  const handleClearUnassignedJobs = async () => {
    try {
      const unassignedJobs = jobs.filter(j => !j.projectId)
      for (const job of unassignedJobs) {
        await window.db.deleteJob(job.id)
      }
      setJobs(prev => prev.filter(j => !!j.projectId))
    } catch (error: any) {
      console.error('Failed to clear unassigned jobs:', error)
      alert(`Failed to clear unassigned jobs: ${error.message || error}`)
    }
  }

  const handleMoveUnassignedJobs = async (targetProjectId: string) => {
    try {
      const unassignedJobs = jobs.filter(j => !j.projectId)
      for (const job of unassignedJobs) {
        const updatedJob = { ...job, projectId: targetProjectId }
        await window.db.updateJob(updatedJob)
      }
      setJobs(prev => prev.map(j => !j.projectId ? { ...j, projectId: targetProjectId } : j))
    } catch (error: any) {
      console.error('Failed to move unassigned jobs:', error)
      alert(`Failed to move unassigned jobs: ${error.message || error}`)
    }
  }

  const renderMainView = () => (
    <>
      <div className="timer-card">
        <div className="time-display">{formatTime(elapsed)}</div>

        <div className="controls">
          {!activeJob ? (
            <button className="btn-start" onClick={startTimer}>{t('common.start')}</button>
          ) : (
            <button className="btn-stop" onClick={stopTimer}>{t('common.stop')}</button>
          )}
        </div>

        <div className="inputs">
          <input
            type="text"
            placeholder={t('main.placeholder')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={!!activeJob}
            className="input-note"
          />

          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value || null)}
            disabled={!!activeJob}
            className="select-project"
          >
            <option value="">{t('main.noProject')}</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {isAddingProject ? (
            <div className="add-project-input-group">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={t('projects.newProjectPlaceholder')}
                className="input-project-name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddProject()
                  if (e.key === 'Escape') setIsAddingProject(false)
                }}
              />
              <button className="btn-icon btn-confirm" onClick={() => handleAddProject()}>✓</button>
              <button className="btn-icon btn-cancel" onClick={() => setIsAddingProject(false)}>✕</button>
            </div>
          ) : (
            <button className="btn-icon" onClick={() => setIsAddingProject(true)} title={t('projects.addProject')}>+</button>
          )}
        </div>
      </div>

      <div className="job-list">
        <h2>{t('main.recentJobs')}</h2>
        <div className="list-content">
          {jobs.slice().reverse().map(job => {
            return (
              <div key={job.id} className="job-item">
                <div className="job-info">
                  <span className="job-time">{formatTime(job.duration)}</span>
                  <span className="job-desc">{job.description || t('main.noDescription')}</span>
                </div>
                <select
                  className="job-project-select"
                  value={job.projectId || ''}
                  onChange={async (e) => {
                    const newProjectId = e.target.value || null
                    const updatedJob = { ...job, projectId: newProjectId }
                    await window.db.updateJob(updatedJob)
                    setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j))
                  }}
                >
                  <option value="">{t('main.noProject')}</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="main-content">
        <main className="content-area">
          {currentView === 'main' && renderMainView()}
          {currentView === 'stats' && <StatsView projects={projects} jobs={jobs} />}
          {currentView === 'projects' && (
            <ProjectsView
              projects={projects}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onClearUnassignedJobs={handleClearUnassignedJobs}
              onMoveUnassignedJobs={handleMoveUnassignedJobs}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
