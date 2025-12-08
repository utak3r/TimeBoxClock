import { describe, it, expect } from 'vitest'
import { consolidateJobs, Job } from './consolidation'

// Helper to create date
const createDate = (year: number, month: number, day: number, hour: number = 0) => {
    return new Date(year, month, day, hour).getTime()
}

describe('consolidateJobs', () => {
    it('should not consolidate jobs from today', () => {
        // Current date: 2023-01-02
        const now = new Date(2023, 0, 2, 12, 0, 0)

        // Jobs from today (2023-01-02)
        const jobs: Job[] = [
            {
                id: 'j1',
                projectId: 'p1',
                description: 'Job 1',
                startTime: createDate(2023, 0, 2, 9),
                endTime: createDate(2023, 0, 2, 10),
                duration: 3600,
                isRunning: false
            },
            {
                id: 'j2',
                projectId: 'p1',
                description: 'Job 2',
                startTime: createDate(2023, 0, 2, 10),
                endTime: createDate(2023, 0, 2, 11),
                duration: 3600,
                isRunning: false
            }
        ]

        const result = consolidateJobs(jobs, now)
        expect(result).toHaveLength(2)
        expect(result[0].id).toBe('j1')
        expect(result[1].id).toBe('j2')
    })

    it('should consolidate jobs from yesterday into one entry per project', () => {
        // Current date: 2023-01-02
        const now = new Date(2023, 0, 2, 12, 0, 0)

        // Jobs from yesterday (2023-01-01)
        const jobs: Job[] = [
            {
                id: 'j1',
                projectId: 'p1',
                description: 'Job 1',
                startTime: createDate(2023, 0, 1, 9),
                endTime: createDate(2023, 0, 1, 10),
                duration: 3600,
                isRunning: false
            },
            {
                id: 'j2',
                projectId: 'p1',
                description: 'Job 2',
                startTime: createDate(2023, 0, 1, 11),
                endTime: createDate(2023, 0, 1, 12),
                duration: 3600,
                isRunning: false
            }
        ]

        const result = consolidateJobs(jobs, now)
        expect(result).toHaveLength(1)

        const consolidated = result[0]
        expect(consolidated.projectId).toBe('p1')
        expect(consolidated.duration).toBe(7200) // 3600 + 3600
        expect(consolidated.description).toContain('Consolidated: 2 jobs')
        expect(consolidated.startTime).toBe(createDate(2023, 0, 1, 9)) // Earliest start
        expect(consolidated.endTime).toBe(createDate(2023, 0, 1, 12)) // Latest end
    })

    it('should treat jobs from different projects separately', () => {
        const now = new Date(2023, 0, 2, 12)

        // Yesterday
        const jobs: Job[] = [
            {
                id: 'j1',
                projectId: 'p1',
                description: 'Job 1',
                startTime: createDate(2023, 0, 1, 9),
                endTime: createDate(2023, 0, 1, 10),
                duration: 3600,
                isRunning: false
            },
            {
                id: 'j2',
                projectId: 'p2', // Different project
                description: 'Job 2',
                startTime: createDate(2023, 0, 1, 9),
                endTime: createDate(2023, 0, 1, 10),
                duration: 3600,
                isRunning: false
            }
        ]

        const result = consolidateJobs(jobs, now)
        expect(result).toHaveLength(2)
        expect(result.find(j => j.projectId === 'p1')).toBeDefined()
        expect(result.find(j => j.projectId === 'p2')).toBeDefined()
    })

    it('should not trigger consolidation for running jobs even if old', () => {
        const now = new Date(2023, 0, 2, 12)

        const jobs: Job[] = [
            {
                id: 'j1',
                projectId: 'p1',
                description: 'Running Job',
                startTime: createDate(2023, 0, 1, 9),
                endTime: null,
                duration: 0,
                isRunning: true // Running
            }
        ]

        const result = consolidateJobs(jobs, now)
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('j1') // ID preserved
        expect(result[0].isRunning).toBe(true)
    })

    it('should correctly handle multiple days of history', () => {
        const now = new Date(2023, 0, 4, 12) // Jan 4th

        const jobs: Job[] = [
            // Jan 1
            { id: 'j1', projectId: 'p1', description: 'J1', startTime: createDate(2023, 0, 1, 10), endTime: createDate(2023, 0, 1, 11), duration: 3600, isRunning: false },
            { id: 'j2', projectId: 'p1', description: 'J2', startTime: createDate(2023, 0, 1, 12), endTime: createDate(2023, 0, 1, 13), duration: 3600, isRunning: false },
            // Jan 2
            { id: 'j3', projectId: 'p1', description: 'J3', startTime: createDate(2023, 0, 2, 10), endTime: createDate(2023, 0, 2, 11), duration: 3600, isRunning: false },
            { id: 'j4', projectId: 'p1', description: 'J4', startTime: createDate(2023, 0, 2, 12), endTime: createDate(2023, 0, 2, 13), duration: 3600, isRunning: false },
            // Jan 4 (Today)
            { id: 'j5', projectId: 'p1', description: 'J5', startTime: createDate(2023, 0, 4, 10), endTime: createDate(2023, 0, 4, 11), duration: 3600, isRunning: false },
        ]

        const result = consolidateJobs(jobs, now)

        // Expect 3 entries: 
        // 1 consolidated for Jan 1
        // 1 consolidated for Jan 2
        // 1 original for Jan 4
        expect(result).toHaveLength(3)

        // Verify dates
        const dates = result.map(j => new Date(j.startTime).getDate()).sort((a, b) => a - b)
        expect(dates).toEqual([1, 2, 4])
    })
})
