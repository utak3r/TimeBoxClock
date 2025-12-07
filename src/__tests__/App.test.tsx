import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the window.db API
const mockDb = {
    getProjects: vi.fn(),
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    getJobs: vi.fn(),
    addJob: vi.fn(),
    updateJob: vi.fn(),
    deleteJob: vi.fn()
}

// Assign mock to window
Object.defineProperty(window, 'db', { value: mockDb })

// Mock uuid
vi.mock('uuid', () => ({
    v4: () => 'test-uuid'
}))

describe('App Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockDb.getProjects.mockResolvedValue([])
        mockDb.getJobs.mockResolvedValue([])
        // Mock alert and console.error
        vi.spyOn(window, 'alert').mockImplementation(() => { })
        vi.spyOn(console, 'error').mockImplementation(() => { })
    })

    it('loads and displays projects', async () => {
        mockDb.getProjects.mockResolvedValue([
            { id: '1', name: 'Test Project', color: '#ff0000' }
        ])

        render(<App />)

        await waitFor(() => {
            expect(screen.getByText('Test Project')).toBeInTheDocument()
        })
    })

    it('adds a new project', async () => {
        const user = userEvent.setup()
        mockDb.addProject.mockImplementation((p) => Promise.resolve(p))

        render(<App />)

        // Navigate to Projects view
        await user.click(screen.getByText('Projects'))

        // Add project
        const input = screen.getByTestId('new-project-input')
        await user.type(input, 'New Project')

        await user.click(screen.getByText('Add Project'))

        await waitFor(() => {
            expect(mockDb.addProject).toHaveBeenCalled()
            expect(screen.getByText('New Project')).toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('starts and stops timer', async () => {
        const user = userEvent.setup()
        mockDb.addJob.mockImplementation((j) => Promise.resolve(j))
        mockDb.updateJob.mockImplementation((j) => Promise.resolve(j))

        render(<App />)

        // Start timer
        await user.click(screen.getByText('Start'))

        await waitFor(() => {
            expect(mockDb.addJob).toHaveBeenCalled()
            expect(screen.getByText('Stop')).toBeInTheDocument()
        })

        // Stop timer
        await user.click(screen.getByText('Stop'))

        await waitFor(() => {
            expect(mockDb.updateJob).toHaveBeenCalled()
            expect(screen.getByText('Start')).toBeInTheDocument()
        })
    })
})
