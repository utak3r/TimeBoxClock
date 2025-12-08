import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
            <h2>{t('projects.title')}</h2>

            <div className="add-project-section">
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder={t('projects.newProjectPlaceholder')}
                    className="input-new-project"
                    data-testid="new-project-input"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="btn-add">{t('projects.addProject')}</button>
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
                                    <button onClick={() => startEditing(project)} className="btn-small">{t('common.edit')}</button>
                                    <button onClick={() => setDeletingProjectId(project.id)} className="btn-small btn-danger">{t('common.delete')}</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="unassigned-jobs-section">
                <h3>{t('projects.unassignedJobs')}</h3>
                { }
                <div className="unassigned-actions">
                    <button onClick={() => setShowClearConfirm(true)} className="btn-small btn-danger">{t('projects.clearUnassigned')}</button>
                    <button onClick={() => {
                        if (projects.length > 0) {
                            setMoveTargetProjectId(projects[0].id);
                            setShowMoveModal(true);
                        } else {
                            alert(t('projects.noProjectsAlert') || "No projects available to move jobs to.");
                        }
                    }} className="btn-small">{t('projects.moveUnassigned')}</button>
                </div>
            </div>

            {deletingProjectId && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{t('projects.title')}</h3>
                        <p>{t('projects.deleteConfirmation')}</p>
                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    onDeleteProject(deletingProjectId, false);
                                    setDeletingProjectId(null);
                                }}
                                className="btn-secondary"
                            >
                                {t('projects.keepJobs')}
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteProject(deletingProjectId, true);
                                    setDeletingProjectId(null);
                                }}
                                className="btn-danger"
                            >
                                {t('projects.deleteJobs')}
                            </button>
                            <button
                                onClick={() => setDeletingProjectId(null)}
                                className="btn-cancel"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showClearConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{t('projects.clearUnassigned')}</h3>
                        <p>{t('projects.deleteConfirmation')}</p>
                        {/* Reusing deleteConfirmation or should genericize. 
                           "Are you sure you want to delete all jobs that are not assigned to any project?"
                           I'll use a new key `projects.clearConfirmation` later, or just reuse/adapt.
                           I'll use a generic confirm for now.
                        */}
                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    onClearUnassignedJobs();
                                    setShowClearConfirm(false);
                                }}
                                className="btn-danger"
                            >
                                {t('common.yes')}
                            </button>
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="btn-cancel"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMoveModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{t('projects.moveUnassigned')}</h3>
                        <p>{t('projects.moveInstruction') || "Select a project:"}</p>
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
                                {t('common.confirm')}
                            </button>
                            <button
                                onClick={() => setShowMoveModal(false)}
                                className="btn-cancel"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
