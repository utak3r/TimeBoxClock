import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '../Sidebar'
import { describe, it, expect, vi } from 'vitest'

describe('Sidebar', () => {
    it('renders navigation buttons', () => {
        const onViewChange = vi.fn()
        render(<Sidebar currentView="main" onViewChange={onViewChange} />)

        expect(screen.getByText('Main')).toBeInTheDocument()
        expect(screen.getByText('Projects')).toBeInTheDocument()
        expect(screen.getByText('Stats')).toBeInTheDocument()
    })

    it('highlights active view', () => {
        const onViewChange = vi.fn()
        render(<Sidebar currentView="projects" onViewChange={onViewChange} />)

        expect(screen.getByText('Projects')).toHaveClass('active')
        expect(screen.getByText('Main')).not.toHaveClass('active')
    })

    it('calls onViewChange when clicked', () => {
        const onViewChange = vi.fn()
        render(<Sidebar currentView="main" onViewChange={onViewChange} />)

        fireEvent.click(screen.getByText('Projects'))
        expect(onViewChange).toHaveBeenCalledWith('projects')
    })
})
