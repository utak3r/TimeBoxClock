import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectsViewProps {
    projects: Project[];
    onAddProject: (name: string) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (id: string, deleteJobs: boolean) => void;
    onClearUnassignedJobs: () => void;
    onMoveUnassignedJobs: (targetProjectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
    projects,
    onAddProject,
    onUpdateProject,
    onDeleteProject,
    onClearUnassignedJobs,
    onMoveUnassignedJobs
}) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

    // State for unassigned jobs management
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [moveTargetProjectId, setMoveTargetProjectId] = useState<string>('');

    const handleAdd = () => {
        if (newProjectName.trim()) {
            onAddProject(newProjectName);
            setNewProjectName('');
        }
    };

    const startEditing = (project: Project) => {
        setEditingProjectId(project.id);
        setEditName(project.name);
    };

    const saveEdit = () => {
        if (editingProjectId && editName.trim()) {
            const project = projects.find(p => p.id === editingProjectId);
            if (project) {
                onUpdateProject({ ...project, name: editName });
            }
            setEditingProjectId(null);
            setEditName('');
        }
    };

    const cancelEdit = () => {
        setEditingProjectId(null);
        setEditName('');
    };

    return (
        <div className="projects-view">
            <h2>Projects</h2>

            <div className="add-project-section">
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="New Project Name"
                    className="input-new-project"
                    data-testid="new-project-input"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="btn-add">Add Project</button>
            </div>

            <div className="projects-list">
                {projects.map(project => (
                    <div key={project.id} className="project-item">
                        {editingProjectId === project.id ? (
                            <div className="edit-mode">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEdit();
                                        if (e.key === 'Escape') cancelEdit();
                                    }}
                                />
                                <button onClick={saveEdit} className="btn-icon btn-confirm">✓</button>
                                <button onClick={cancelEdit} className="btn-icon btn-cancel">✕</button>
                            </div>
                        ) : (
                            <>
                                <div className="project-info">
                                    <span className="project-color" style={{ backgroundColor: project.color }}></span>
                                    <span className="project-name">{project.name}</span>
                                </div>
                                <div className="project-actions">
                                    <button onClick={() => startEditing(project)} className="btn-small">Rename</button>
                                    <button onClick={() => setDeletingProjectId(project.id)} className="btn-small btn-danger">Remove</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="unassigned-jobs-section">
                <h3>Jobs without a project</h3>
                <div className="unassigned-actions">
                    <button onClick={() => setShowClearConfirm(true)} className="btn-small btn-danger">Clear jobs</button>
                    <button onClick={() => {
                        if (projects.length > 0) {
                            setMoveTargetProjectId(projects[0].id);
                            setShowMoveModal(true);
                        } else {
                            alert("No projects available to move jobs to.");
                        }
                    }} className="btn-small">Move jobs to a project</button>
                </div>
            </div>

            {deletingProjectId && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Remove Project</h3>
                        <p>What should happen to the jobs associated with this project?</p>
                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    onDeleteProject(deletingProjectId, false);
                                    setDeletingProjectId(null);
                                }}
                                className="btn-secondary"
                            >
                                Move to "No Project"
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteProject(deletingProjectId, true);
                                    setDeletingProjectId(null);
                                }}
                                className="btn-danger"
                            >
                                Delete Jobs
                            </button>
                            <button
                                onClick={() => setDeletingProjectId(null)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showClearConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Clear Unassigned Jobs</h3>
                        <p>Are you sure you want to delete all jobs that are not assigned to any project? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    onClearUnassignedJobs();
                                    setShowClearConfirm(false);
                                }}
                                className="btn-danger"
                            >
                                Yes, Clear Jobs
                            </button>
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMoveModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Move Unassigned Jobs</h3>
                        <p>Select a project to move all unassigned jobs to:</p>
                        <select
                            value={moveTargetProjectId}
                            onChange={(e) => setMoveTargetProjectId(e.target.value)}
                            className="select-project-modal"
                        >
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    if (moveTargetProjectId) {
                                        onMoveUnassignedJobs(moveTargetProjectId);
                                        setShowMoveModal(false);
                                    }
                                }}
                                className="btn-confirm"
                            >
                                Move Jobs
                            </button>
                            <button
                                onClick={() => setShowMoveModal(false)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
