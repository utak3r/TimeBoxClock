import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '../Sidebar'
import { describe, it, expect, vi } from 'vitest'

describe('Sidebar', () => {
    it('renders navigation buttons', () => {
        const onViewChange = vi.fn()
        render(<Sidebar currentView="main" onViewChange={onViewChange} />)


        expect(screen.getByText('sidebar.timer')).toBeInTheDocument()
        expect(screen.getByText('sidebar.projects')).toBeInTheDocument()
        expect(screen.getByText('sidebar.stats')).toBeInTheDocument()
    })

    it('highlights active view', () => {
        const onViewChange = vi.fn()
        render(<Sidebar currentView="projects" onViewChange={onViewChange} />)

        expect(screen.getByText('sidebar.projects')).toHaveClass('active')
        expect(screen.getByText('sidebar.timer')).not.toHaveClass('active')
    })

    it('calls onViewChange when clicked', () => {
        const onViewChange = vi.fn()
        render(<Sidebar currentView="main" onViewChange={onViewChange} />)

        fireEvent.click(screen.getByText('sidebar.timer'))
        expect(onViewChange).toHaveBeenCalledWith('main')

        fireEvent.click(screen.getByText('sidebar.projects'))
        expect(onViewChange).toHaveBeenCalledWith('projects')

        fireEvent.click(screen.getByText('sidebar.stats'))
        expect(onViewChange).toHaveBeenCalledWith('stats')
    })
})
