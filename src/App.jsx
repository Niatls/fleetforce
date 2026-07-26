import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VacancyList } from './components/VacancyList';
import { SeafarerHub } from './components/SeafarerHub';
import { ShipownerServices } from './components/ShipownerServices';
import { OfficesAndContacts } from './components/OfficesAndContacts';
import { Footer } from './components/Footer';
import { ApplicationWizard } from './components/ApplicationWizard/ApplicationWizard';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { INITIAL_VACANCIES, INITIAL_CANDIDATES } from './data/initialData';

function AppContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [searchFilter, setSearchFilter] = useState({ rank: '', vesselType: '' });

  // Modals state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardInitialRank, setWizardInitialRank] = useState('');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Data State with LocalStorage Persistence Fallback
  const [vacancies, setVacancies] = useState(() => {
    const saved = localStorage.getItem('fleetforce_vacancies');
    return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
  });

  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('fleetforce_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  // Load saved theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('fleetforce_theme') || 'ocean-soft';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Try fetching from Express Backend API if online
  useEffect(() => {
    fetch('/api/vacancies')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length) {
          setVacancies(data.data);
        }
      })
      .catch(() => {
        // Express backend offline, running in local standalone mode
      });

    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length) {
          setCandidates(data.data);
        }
      })
      .catch(() => {
        // Express backend offline
      });
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fleetforce_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('fleetforce_candidates', JSON.stringify(candidates));
  }, [candidates]);

  // Handlers
  const handleOpenWizard = (rank = '') => {
    setWizardInitialRank(rank);
    setWizardOpen(true);
  };

  const handleApplyVacancy = (vac) => {
    handleOpenWizard(vac.rank || vac.title);
  };

  const handleCandidateSubmit = (newCandidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);

    // Send to backend API if available
    fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCandidate)
    }).catch(() => {});
  };

  const handleUpdateCandidateStatus = (id, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );

    fetch(`/api/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  const handleSaveCandidateNotes = (id, notes) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );

    fetch(`/api/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    }).catch(() => {});
  };

  const handleAddVacancy = (newVac) => {
    setVacancies((prev) => [newVac, ...prev]);

    fetch('/api/vacancies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVac)
    }).catch(() => {});
  };

  const handleUpdateVacancy = (updatedVac) => {
    setVacancies((prev) =>
      prev.map((v) => (v.id === updatedVac.id ? updatedVac : v))
    );

    fetch(`/api/vacancies/${updatedVac.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedVac)
    }).catch(() => {});
  };

  const handleDeleteVacancy = (id) => {
    setVacancies((prev) => prev.filter((v) => v.id !== id));

    fetch(`/api/vacancies/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleOpenAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setAdminDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar 
        onOpenWizard={() => handleOpenWizard('')}
        onOpenAdmin={handleOpenAdminTrigger}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Hero Section */}
      <Hero 
        onSearch={(filters) => setSearchFilter(filters)}
        onOpenWizard={() => handleOpenWizard('')}
      />

      {/* Vacancy Board */}
      <VacancyList 
        vacancies={vacancies}
        searchFilter={searchFilter}
        onApplyVacancy={handleApplyVacancy}
      />

      {/* Seafarer Hub / Downloads */}
      <SeafarerHub 
        onOpenWizard={() => handleOpenWizard('')}
      />

      {/* Shipowners Services */}
      <ShipownerServices />

      {/* Offices & Contact Map */}
      <OfficesAndContacts />

      {/* Footer */}
      <Footer 
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Seafarer Application Wizard Modal */}
      <ApplicationWizard 
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialRank={wizardInitialRank}
        onSubmitSuccess={handleCandidateSubmit}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setAdminDashboardOpen(true);
        }}
      />

      {/* Admin Control Dashboard Modal */}
      <AdminDashboard 
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        candidates={candidates}
        vacancies={vacancies}
        onUpdateCandidateStatus={handleUpdateCandidateStatus}
        onSaveCandidateNotes={handleSaveCandidateNotes}
        onAddVacancy={handleAddVacancy}
        onUpdateVacancy={handleUpdateVacancy}
        onDeleteVacancy={handleDeleteVacancy}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
