import { randomUUID } from 'node:crypto'

export interface Project {
    id: string;
    name: string;
    color: string;
}

export interface Job {
    id: string;
    projectId: string | null;
    description: string;
    startTime: number;
    endTime: number | null;
    duration: number; // stored in seconds
    isRunning: boolean;
}

export function consolidateJobs(jobs: Job[], projects: Project[], now: Date = new Date()): Job[] {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    const jobsToKeep: Job[] = []
    const jobsToConsolidate: Job[] = []

    jobs.forEach(job => {
        // Keep running jobs regardless
        if (job.isRunning) {
            jobsToKeep.push(job)
            return
        }

        // Check if job is from today
        if (job.startTime >= startOfToday) {
            jobsToKeep.push(job)
        } else {
            jobsToConsolidate.push(job)
        }
    })

    // If nothing to consolidate, just return original list (or new list with same items)
    if (jobsToConsolidate.length === 0) {
        return jobs
    }

    // Grouping: Key format: "YYYY-MM-DD|projectId"
    const groups = new Map<string, Job[]>()

    jobsToConsolidate.forEach(job => {
        const date = new Date(job.startTime)
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const key = `${dateStr}|${job.projectId || 'null'}`

        if (!groups.has(key)) {
            groups.set(key, [])
        }
        groups.get(key)!.push(job)
    })

    const consolidatedJobs: Job[] = []

    for (const [key, group] of groups) {
        // If only one job in group, just keep it
        if (group.length === 1) {
            consolidatedJobs.push(group[0])
            continue
        }

        const [, projectIdStr] = key.split('|')
        const projectId = projectIdStr === 'null' ? null : projectIdStr

        const totalDuration = group.reduce((sum, j) => sum + j.duration, 0)
        const startTime = Math.min(...group.map(j => j.startTime))
        const endTime = Math.max(...group.map(j => j.endTime || j.startTime + j.duration * 1000))

        const consolidatedJob: Job = {
            id: randomUUID(),
            projectId: projectId,
            description: `Consolidated: ${group.length} jobs`,
            startTime: startTime,
            endTime: endTime,
            duration: totalDuration,
            isRunning: false
        }

        consolidatedJobs.push(consolidatedJob)
    }

    const newJobList = [...jobsToKeep, ...consolidatedJobs]
    // Sort by startTime
    newJobList.sort((a, b) => a.startTime - b.startTime)

    return newJobList
}
