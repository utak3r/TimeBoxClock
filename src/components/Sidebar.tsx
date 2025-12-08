import React from 'react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
    currentView: 'main' | 'projects' | 'stats';
    onViewChange: (view: 'main' | 'projects' | 'stats') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'pl' : 'en';
        i18n.changeLanguage(newLang);

        // Notify main process to update tray
        if (window.ipcRenderer) {
            window.ipcRenderer.send('language-changed', newLang);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>{t('appTitle')}</h2>
            </div>
            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${currentView === 'main' ? 'active' : ''}`}
                    onClick={() => onViewChange('main')}
                >
                    {t('sidebar.timer')}
                </button>
                <button
                    className={`nav-item ${currentView === 'projects' ? 'active' : ''}`}
                    onClick={() => onViewChange('projects')}
                >
                    {t('sidebar.projects')}
                </button>
                <button
                    className={`nav-item ${currentView === 'stats' ? 'active' : ''}`}
                    onClick={() => onViewChange('stats')}
                >
                    {t('sidebar.stats')}
                </button>
            </nav>

            <div className="sidebar-footer">
                <button onClick={toggleLanguage} className="lang-toggle">
                    {i18n.language === 'en' ? 'PL' : 'EN'}
                </button>
            </div>
        </div>
    );
};

