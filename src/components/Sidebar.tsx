import React from 'react';

interface SidebarProps {
    currentView: 'main' | 'projects' | 'stats';
    onViewChange: (view: 'main' | 'projects' | 'stats') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>TimeBoxClock</h2>
            </div>
            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${currentView === 'main' ? 'active' : ''}`}
                    onClick={() => onViewChange('main')}
                >
                    Main
                </button>
                <button
                    className={`nav-item ${currentView === 'projects' ? 'active' : ''}`}
                    onClick={() => onViewChange('projects')}
                >
                    Projects
                </button>
                <button
                    className={`nav-item ${currentView === 'stats' ? 'active' : ''}`}
                    onClick={() => onViewChange('stats')}
                >
                    Stats
                </button>
            </nav>
        </div>
    );
};
