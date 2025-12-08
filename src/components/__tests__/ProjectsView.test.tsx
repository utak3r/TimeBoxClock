import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectsView } from '../ProjectsView'
import { describe, it, expect, vi } from 'vitest'
import { Project } from '../../types'

const mockProjects: Project[] = [
    { id: '1', name: 'Project A', color: '#ff0000' },
    { id: '2', name: 'Project B', color: '#00ff00' }
]

describe('ProjectsView', () => {
    it('renders project list', () => {
        render(
            <ProjectsView
                projects={mockProjects}
                onAddProject={vi.fn()}
                onUpdateProject={vi.fn()}
                onDeleteProject={vi.fn()}
                onClearUnassignedJobs={vi.fn()}
                onMoveUnassignedJobs={vi.fn()}
            />
        )

        expect(screen.getByText('Project A')).toBeInTheDocument()
        expect(screen.getByText('Project B')).toBeInTheDocument()
    })

    it('calls onAddProject when adding a new project', () => {
        const onAddProject = vi.fn()
        render(
            <ProjectsView
                projects={mockProjects}
                onAddProject={onAddProject}
                onUpdateProject={vi.fn()}
                onDeleteProject={vi.fn()}
                onClearUnassignedJobs={vi.fn()}
                onMoveUnassignedJobs={vi.fn()}
            />
        )

        const input = screen.getByPlaceholderText('projects.newProjectPlaceholder')
        fireEvent.change(input, { target: { value: 'New Project' } })
        fireEvent.click(screen.getByText('projects.addProject'))

        expect(onAddProject).toHaveBeenCalledWith('New Project')
    })

    it('opens delete modal when remove is clicked', () => {
        render(
            <ProjectsView
                projects={mockProjects}
                onAddProject={vi.fn()}
                onUpdateProject={vi.fn()}
                onDeleteProject={vi.fn()}
                onClearUnassignedJobs={vi.fn()}
                onMoveUnassignedJobs={vi.fn()}
            />
        )

        const removeButtons = screen.getAllByText('common.delete')
        fireEvent.click(removeButtons[0])

        expect(screen.getAllByText('projects.title')[1]).toBeInTheDocument() // Modal title is same as main title
        expect(screen.getByText('projects.keepJobs')).toBeInTheDocument()
        expect(screen.getByText('projects.deleteJobs')).toBeInTheDocument()
    })
})
