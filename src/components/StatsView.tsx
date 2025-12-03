import React, { useMemo } from 'react';
import { Project, Job } from '../types';

interface StatsViewProps {
    projects: Project[];
    jobs: Job[];
}

export const StatsView: React.FC<StatsViewProps> = ({ projects, jobs }) => {
    const stats = useMemo(() => {
        const projectStats = new Map<string, number>();
        let totalTime = 0;

        // Initialize with 0 for all projects
        projects.forEach(p => projectStats.set(p.id, 0));
        // Also track 'No Project'
        projectStats.set('no-project', 0);

        jobs.forEach(job => {
            const projectId = job.projectId || 'no-project';
            const current = projectStats.get(projectId) || 0;
            projectStats.set(projectId, current + job.duration);
            totalTime += job.duration;
        });

        return {
            projectStats,
            totalTime
        };
    }, [projects, jobs]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="stats-view">
            <h2>Statistics</h2>

            <div className="stats-summary">
                <div className="stat-card">
                    <h3>Total Time Tracked</h3>
                    <p className="stat-value">{formatTime(stats.totalTime)}</p>
                </div>
            </div>

            <div className="stats-table-container">
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Time</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProjects.map(project => {
                            const duration = stats.projectStats.get(project.id) || 0;
                            const percentage = stats.totalTime > 0 ? (duration / stats.totalTime) * 100 : 0;

                            return (
                                <tr key={project.id}>
                                    <td>
                                        <span
                                            className="project-dot"
                                            style={{ backgroundColor: project.color }}
                                        ></span>
                                        {project.name}
                                    </td>
                                    <td>{formatTime(duration)}</td>
                                    <td>{percentage.toFixed(1)}%</td>
                                </tr>
                            );
                        })}
                        {/* No Project Row */}
                        <tr>
                            <td>
                                <span className="project-dot" style={{ backgroundColor: '#ccc' }}></span>
                                No Project
                            </td>
                            <td>{formatTime(stats.projectStats.get('no-project') || 0)}</td>
                            <td>
                                {(stats.totalTime > 0
                                    ? ((stats.projectStats.get('no-project') || 0) / stats.totalTime) * 100
                                    : 0
                                ).toFixed(1)}%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
