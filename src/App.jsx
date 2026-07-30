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
import { 
  INITIAL_VACANCIES, 
  INITIAL_CANDIDATES, 
  INITIAL_OFFICES, 
  INITIAL_HUB_BLOCKS,
  INITIAL_STATS,
  INITIAL_SHIPOWNER_REQUESTS
} from './data/initialData';

function AppContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [searchFilter, setSearchFilter] = useState({ rank: '', vesselType: '' });

  // Modals & Page View state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardParams, setWizardParams] = useState({ rank: '', vesselType: '' });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('fleetforce_admin_auth') === 'true';
  });

  // Standalone Page View: 'main' or 'admin'
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#/admin' ? 'admin' : 'main';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('main');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global protection: Prevent text selection and copying site-wide (except inside form inputs)
  useEffect(() => {
    const handleCopy = (e) => {
      const target = e.target;
      const isInput = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.isContentEditable
      );
      if (!isInput) {
        e.preventDefault();
      }
    };

    const handleSelectStart = (e) => {
      const target = e.target;
      const isInput = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.isContentEditable
      );
      if (!isInput) {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#/admin';
    setCurrentPage('admin');
  };

  const navigateToMain = () => {
    window.location.hash = '';
    setCurrentPage('main');
  };

  const handleOpenAdminTrigger = () => {
    navigateToAdmin();
  };

  // Data State with LocalStorage Persistence Fallback
  const [vacancies, setVacancies] = useState(() => {
    const saved = localStorage.getItem('fleetforce_vacancies');
    return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
  });

  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('fleetforce_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [offices, setOffices] = useState(() => {
    const saved = localStorage.getItem('fleetforce_offices');
    return saved ? JSON.parse(saved) : INITIAL_OFFICES;
  });

  const [hubBlocks, setHubBlocks] = useState(() => {
    const saved = localStorage.getItem('fleetforce_hub_blocks');
    return saved ? JSON.parse(saved) : INITIAL_HUB_BLOCKS;
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('fleetforce_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [shipownerRequests, setShipownerRequests] = useState(() => {
    const saved = localStorage.getItem('fleetforce_shipowner_requests');
    return saved ? JSON.parse(saved) : INITIAL_SHIPOWNER_REQUESTS;
  });

  const [sectionVisibility, setSectionVisibility] = useState(() => {
    const saved = localStorage.getItem('fleetforce_section_visibility');
    return saved ? JSON.parse(saved) : {
      hero: true,
      vacancies: true,
      hub: true,
      shipowners: true,
      offices: true
    };
  });

  useEffect(() => {
    localStorage.setItem('fleetforce_section_visibility', JSON.stringify(sectionVisibility));
  }, [sectionVisibility]);

  // Load saved theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('fleetforce_theme') || 'ocean-soft';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Try fetching from Backend API (Vercel Serverless / Node Express) if online
  useEffect(() => {
    fetch('/api/vacancies')
      .then((res) => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data?.length) {
          setVacancies((prev) => {
            const map = new Map();
            data.data.forEach((v) => map.set(v.id, v));
            prev.forEach((v) => map.set(v.id, v));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});

    fetch('/api/candidates')
      .then((res) => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data?.length) {
          setCandidates((prev) => {
            const map = new Map();
            data.data.forEach((c) => map.set(c.id, c));
            prev.forEach((c) => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});

    fetch('/api/shipowner-requests')
      .then((res) => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data?.length) {
          setShipownerRequests((prev) => {
            const map = new Map();
            data.data.forEach((r) => map.set(r.id, r));
            prev.forEach((r) => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fleetforce_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('fleetforce_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('fleetforce_offices', JSON.stringify(offices));
  }, [offices]);

  useEffect(() => {
    localStorage.setItem('fleetforce_hub_blocks', JSON.stringify(hubBlocks));
  }, [hubBlocks]);

  useEffect(() => {
    localStorage.setItem('fleetforce_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('fleetforce_shipowner_requests', JSON.stringify(shipownerRequests));
  }, [shipownerRequests]);

  // Handlers
  const handleUpdateStats = (newStats) => {
    setStats(newStats);
  };

  const handleAddShipownerRequest = (newReq) => {
    setShipownerRequests((prev) => [newReq, ...prev]);

    fetch('/api/shipowner-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    }).catch(() => {});
  };

  const handleUpdateShipownerRequestStatus = (id, newStatus) => {
    setShipownerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    fetch(`/api/shipowner-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  const handleDeleteShipownerRequest = (id) => {
    setShipownerRequests((prev) => prev.filter((r) => r.id !== id));

    fetch(`/api/shipowner-requests/${id}`, { method: 'DELETE' }).catch(() => {});
  };
  const handleOpenWizard = (rank = '', vesselType = '') => {
    setWizardParams({ rank, vesselType });
    setWizardOpen(true);
  };

  const handleApplyVacancy = (vac) => {
    handleOpenWizard(vac.rank || vac.title || '', vac.vesselType || '');
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

  const handleUpdateCandidateFiles = (id, files) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, attachedFiles: files } : c))
    );

    fetch(`/api/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attachedFiles: files })
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

  // Office Handlers
  const handleAddOffice = (newOffice) => {
    setOffices((prev) => [...prev, newOffice]);
  };

  const handleUpdateOffice = (updatedOffice) => {
    setOffices((prev) =>
      prev.map((o) => (o.id === updatedOffice.id ? updatedOffice : o))
    );
  };

  const handleDeleteOffice = (id) => {
    setOffices((prev) => prev.filter((o) => o.id !== id));
  };

  // Hub Block Handlers
  const handleAddHubBlock = (newBlock) => {
    setHubBlocks((prev) => [...prev, newBlock]);
  };

  const handleUpdateHubBlock = (updatedBlock) => {
    setHubBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
  };

  const handleDeleteHubBlock = (id) => {
    setHubBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleToggleVacancyActive = (id) => {
    setVacancies((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: v.active === false ? true : false } : v))
    );
  };

  const handleToggleOfficeActive = (id) => {
    setOffices((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: o.active === false ? true : false } : o))
    );
  };

  const handleToggleHubBlockActive = (id) => {
    setHubBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: b.active === false ? true : false } : b))
    );
  };

  const handleToggleSectionVisibility = (sectionKey) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('fleetforce_admin_auth');
    setIsAdminLoggedIn(false);
    navigateToMain();
  };

  // Standalone Admin Page View
  if (currentPage === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginModal 
          isOpen={true}
          onClose={navigateToMain}
          onBackToSite={navigateToMain}
          onLoginSuccess={() => {
            localStorage.setItem('fleetforce_admin_auth', 'true');
            setIsAdminLoggedIn(true);
          }}
        />
      );
    }

    return (
      <AdminDashboard 
        isOpen={true}
        onClose={handleLogoutAdmin}
        onBackToSite={navigateToMain}
        candidates={candidates}
        vacancies={vacancies}
        offices={offices}
        hubBlocks={hubBlocks}
        stats={stats}
        shipownerRequests={shipownerRequests}
        sectionVisibility={sectionVisibility}
        onToggleSectionVisibility={handleToggleSectionVisibility}
        onToggleVacancyActive={handleToggleVacancyActive}
        onToggleOfficeActive={handleToggleOfficeActive}
        onToggleHubBlockActive={handleToggleHubBlockActive}
        onUpdateCandidateStatus={handleUpdateCandidateStatus}
        onSaveCandidateNotes={handleSaveCandidateNotes}
        onUpdateCandidateFiles={handleUpdateCandidateFiles}
        onAddVacancy={handleAddVacancy}
        onUpdateVacancy={handleUpdateVacancy}
        onDeleteVacancy={handleDeleteVacancy}
        onAddOffice={handleAddOffice}
        onUpdateOffice={handleUpdateOffice}
        onDeleteOffice={handleDeleteOffice}
        onAddHubBlock={handleAddHubBlock}
        onUpdateHubBlock={handleUpdateHubBlock}
        onDeleteHubBlock={handleDeleteHubBlock}
        onUpdateStats={handleUpdateStats}
        onUpdateShipownerRequestStatus={handleUpdateShipownerRequestStatus}
        onDeleteShipownerRequest={handleDeleteShipownerRequest}
      />
    );
  }

  // Public Main Website
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
      {sectionVisibility.hero && (
        <Hero 
          onSearch={(filters) => setSearchFilter(filters)}
          onOpenWizard={() => handleOpenWizard('')}
          stats={stats}
        />
      )}

      {/* Vacancy Board */}
      {sectionVisibility.vacancies && (
        <VacancyList 
          vacancies={vacancies}
          searchFilter={searchFilter}
          onApplyVacancy={handleApplyVacancy}
        />
      )}

      {/* Seafarer Hub / Downloads */}
      {sectionVisibility.hub && (
        <SeafarerHub 
          onOpenWizard={() => handleOpenWizard('')}
          hubBlocks={hubBlocks}
        />
      )}

      {/* Shipowners Services */}
      {sectionVisibility.shipowners && (
        <ShipownerServices 
          onRequestSubmit={handleAddShipownerRequest}
        />
      )}

      {/* Offices & Contact Map */}
      {sectionVisibility.offices && (
        <OfficesAndContacts 
          offices={offices}
        />
      )}

      {/* Footer */}
      <Footer 
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Seafarer Application Wizard Modal */}
      <ApplicationWizard 
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialRank={wizardParams.rank}
        initialVesselType={wizardParams.vesselType}
        onSubmitSuccess={handleCandidateSubmit}
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
