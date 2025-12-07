import { render, screen } from '@testing-library/react'
import { StatsView } from '../StatsView'
import { describe, it, expect } from 'vitest'
import { Project, Job } from '../../types'

const mockProjects: Project[] = [
    { id: '1', name: 'Project A', color: '#ff0000' }
]

const mockJobs: Job[] = [
    {
        id: 'j1',
        projectId: '1',
        description: 'Job 1',
        startTime: 1000,
        endTime: 2000,
        duration: 3600, // 1 hour
        isRunning: false
    },
    {
        id: 'j2',
        projectId: null,
        description: 'Job 2',
        startTime: 3000,
        endTime: 4000,
        duration: 1800, // 30 mins
        isRunning: false
    }
]

describe('StatsView', () => {
    it('renders total time correctly', () => {
        render(<StatsView projects={mockProjects} jobs={mockJobs} />)
        // Total 1h 30m = 1h 30m 0s
        expect(screen.getByText('1h 30m 0s')).toBeInTheDocument()
    })

    it('renders project breakdown', () => {
        render(<StatsView projects={mockProjects} jobs={mockJobs} />)

        expect(screen.getByText('Project A')).toBeInTheDocument()
        expect(screen.getByText('1h 0m 0s')).toBeInTheDocument() // Project A duration

        expect(screen.getByText('No Project')).toBeInTheDocument()
        expect(screen.getByText('0h 30m 0s')).toBeInTheDocument() // No Project duration
    })
})
