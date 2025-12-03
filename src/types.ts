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
    duration: number;
    isRunning: boolean;
}

export interface DB {
    getProjects: () => Promise<Project[]>;
    addProject: (project: Project) => Promise<Project>;
    deleteProject: (id: string) => Promise<void>;
    getJobs: () => Promise<Job[]>;
    addJob: (job: Job) => Promise<Job>;
    updateJob: (job: Job) => Promise<Job>;
    deleteJob: (id: string) => Promise<void>;
}

declare global {
    interface Window {
        db: DB;
    }
}
