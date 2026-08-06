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
import { SiteEditor } from './components/Admin/SiteEditor';
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
    try {
      return sessionStorage.getItem('fleetforce_admin_auth') === 'true' || localStorage.getItem('fleetforce_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Standalone Page View: 'main' or 'admin'
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#/admin' ? 'admin' : 'main';
  });

  const [isSiteEditorOpen, setIsSiteEditorOpen] = useState(false);

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

  const getDeletedVacancyIds = () => {
    try {
      const arr = JSON.parse(localStorage.getItem('fleetforce_deleted_vacancy_ids') || '[]');
      return new Set(arr.map((id) => String(id || '').trim().toLowerCase()));
    } catch (e) {
      return new Set();
    }
  };

  const getDeletedCandidateIds = () => {
    try {
      const arr = JSON.parse(localStorage.getItem('fleetforce_deleted_candidate_ids') || '[]');
      return new Set(arr.map((id) => String(id || '').trim().toLowerCase()));
    } catch (e) {
      return new Set();
    }
  };

  const getDeletedRequestIds = () => {
    try {
      const arr = JSON.parse(localStorage.getItem('fleetforce_deleted_request_ids') || '[]');
      return new Set(arr.map((id) => String(id || '').trim().toLowerCase()));
    } catch (e) {
      return new Set();
    }
  };

  // Data State with LocalStorage Persistence Fallback
  const [vacancies, setVacancies] = useState(() => {
    try {
      const deletedIds = getDeletedVacancyIds();
      const saved = localStorage.getItem('fleetforce_vacancies');
      const list = saved ? JSON.parse(saved) : INITIAL_VACANCIES;
      return list.filter((v) => !deletedIds.has(String(v.id || '').trim().toLowerCase()));
    } catch (e) {
      return INITIAL_VACANCIES;
    }
  });

  const [candidates, setCandidates] = useState(() => {
    try {
      const deletedIds = getDeletedCandidateIds();
      const saved = localStorage.getItem('fleetforce_candidates');
      const list = saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
      return list.filter(c => !deletedIds.has(String(c.id || '').trim().toLowerCase()));
    } catch (e) {
      return INITIAL_CANDIDATES;
    }
  });

  const [shipownerRequests, setShipownerRequests] = useState(() => {
    try {
      const deletedIds = getDeletedRequestIds();
      const saved = localStorage.getItem('fleetforce_shipowner_requests');
      const list = saved ? JSON.parse(saved) : INITIAL_SHIPOWNER_REQUESTS;
      return list.filter((r) => !deletedIds.has(String(r.id || '').trim().toLowerCase()));
    } catch (e) {
      return INITIAL_SHIPOWNER_REQUESTS;
    }
  });

  const [offices, setOffices] = useState(() => {
    try {
      const saved = localStorage.getItem('fleetforce_offices');
      return saved ? JSON.parse(saved) : INITIAL_OFFICES;
    } catch (e) {
      return INITIAL_OFFICES;
    }
  });

  const [hubBlocks, setHubBlocks] = useState(() => {
    try {
      const saved = localStorage.getItem('fleetforce_hub_blocks');
      return saved ? JSON.parse(saved) : INITIAL_HUB_BLOCKS;
    } catch (e) {
      return INITIAL_HUB_BLOCKS;
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('fleetforce_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch (e) {
      return INITIAL_STATS;
    }
  });

  const [sectionVisibility, setSectionVisibility] = useState(() => {
    try {
      const saved = localStorage.getItem('fleetforce_section_visibility');
      return saved ? JSON.parse(saved) : {
        hero: true,
        vacancies: true,
        hub: true,
        shipowners: true,
        offices: true
      };
    } catch (e) {
      return { hero: true, vacancies: true, hub: true, shipowners: true, offices: true };
    }
  });

  const [heroBadge, setHeroBadge] = useState(() => localStorage.getItem('fleetforce_hero_badge') || '');
  const [heroTitle, setHeroTitle] = useState(() => localStorage.getItem('fleetforce_hero_title') || '');
  const [heroSubtitle, setHeroSubtitle] = useState(() => localStorage.getItem('fleetforce_hero_subtitle') || '');

  const [vacanciesTitle, setVacanciesTitle] = useState(() => localStorage.getItem('fleetforce_vacancies_title') || '');
  const [vacanciesSubtitle, setVacanciesSubtitle] = useState(() => localStorage.getItem('fleetforce_vacancies_subtitle') || '');

  const [hubTitle, setHubTitle] = useState(() => localStorage.getItem('fleetforce_hub_title') || '');
  const [hubSubtitle, setHubSubtitle] = useState(() => localStorage.getItem('fleetforce_hub_subtitle') || '');

  const [officesTitle, setOfficesTitle] = useState(() => localStorage.getItem('fleetforce_offices_title') || '');
  const [officesSubtitle, setOfficesSubtitle] = useState(() => localStorage.getItem('fleetforce_offices_subtitle') || '');
  const [officesHours, setOfficesHours] = useState(() => localStorage.getItem('fleetforce_offices_hours') || '');

  const [shipownerTitle, setShipownerTitle] = useState(() => localStorage.getItem('fleetforce_shipowner_title') || '');
  const [shipownerSubtitle, setShipownerSubtitle] = useState(() => localStorage.getItem('fleetforce_shipowner_subtitle') || '');
  const [service1Title, setService1Title] = useState(() => localStorage.getItem('fleetforce_service1_title') || '');
  const [service1Desc, setService1Desc] = useState(() => localStorage.getItem('fleetforce_service1_desc') || '');
  const [service2Title, setService2Title] = useState(() => localStorage.getItem('fleetforce_service2_title') || '');
  const [service2Desc, setService2Desc] = useState(() => localStorage.getItem('fleetforce_service2_desc') || '');
  const [service3Title, setService3Title] = useState(() => localStorage.getItem('fleetforce_service3_title') || '');
  const [service3Desc, setService3Desc] = useState(() => localStorage.getItem('fleetforce_service3_desc') || '');

  const [footerBrandDesc, setFooterBrandDesc] = useState(() => localStorage.getItem('fleetforce_footer_brand_desc') || '');
  const [footerCertText, setFooterCertText] = useState(() => localStorage.getItem('fleetforce_footer_cert_text') || '');
  const [footerCopyright, setFooterCopyright] = useState(() => localStorage.getItem('fleetforce_footer_copyright') || '');

  useEffect(() => {
    localStorage.setItem('fleetforce_section_visibility', JSON.stringify(sectionVisibility));
  }, [sectionVisibility]);

  useEffect(() => {
    if (heroTitle) localStorage.setItem('fleetforce_hero_title', heroTitle);
  }, [heroTitle]);

  useEffect(() => {
    if (heroSubtitle) localStorage.setItem('fleetforce_hero_subtitle', heroSubtitle);
  }, [heroSubtitle]);

  // Load saved theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('fleetforce_theme') || 'ocean-soft';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  // Try fetching from Backend API — localStorage always wins (API store resets on server restart)
  useEffect(() => {
    // Helper: merge API data into local state, but LOCAL records always take priority
    // Deleted IDs are never re-added.
    const mergeApiIntoLocal = (apiItems, setFn, keyField = 'id', type = 'vacancy') => {
      const deletedIds = type === 'vacancy' ? getDeletedVacancyIds() : (type === 'request' ? getDeletedRequestIds() : (type === 'candidate' ? getDeletedCandidateIds() : new Set()));
      setFn((prev) => {
        const localIds = new Set(prev.map((item) => String(item[keyField] || '').trim().toLowerCase()));
        const newFromApi = apiItems.filter((item) => {
          const itemKey = String(item[keyField] || '').trim().toLowerCase();
          if (deletedIds.has(itemKey)) return false;
          return !localIds.has(itemKey);
        });
        return newFromApi.length > 0 ? [...prev, ...newFromApi] : prev;
      });
    };

    fetch('/api/vacancies')
      .then((res) => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data?.length) {
          mergeApiIntoLocal(data.data, setVacancies, 'id', 'vacancy');
        }
      })
      .catch(() => {});

    const syncCandidatesWithServer = (serverCandidates) => {
      const deletedIds = getDeletedCandidateIds();
      setCandidates((prev) => {
        const localCandidateMap = new Map();
        prev.forEach((cand) => {
          const idStr = String(cand.id);
          if (!deletedIds.has(idStr)) {
            localCandidateMap.set(idStr, cand);
          }
        });

        serverCandidates.forEach((cand) => {
          const idStr = String(cand.id);
          if (!deletedIds.has(idStr)) {
            if (!localCandidateMap.has(idStr)) {
              localCandidateMap.set(idStr, cand);
            }
          }
        });

        const mergedList = Array.from(localCandidateMap.values());
        try {
          localStorage.setItem('fleetforce_candidates', JSON.stringify(mergedList));
        } catch (e) {}
        return mergedList;
      });
    };

    fetch('/api/candidates.php')
      .then((res) => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          syncCandidatesWithServer(data.data);
        }
      })
      .catch(() => {});

    fetch('/api/candidates')
      .then((res) => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          syncCandidatesWithServer(data.data);
        }
      })
      .catch(() => {});

    fetch('/api/config.php')
      .then((res) => {
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data) {
          if (Array.isArray(data.data.offices)) setOffices(data.data.offices);
          if (Array.isArray(data.data.hub_blocks)) setHubBlocks(data.data.hub_blocks);
          if (Array.isArray(data.data.stats)) setStats(data.data.stats);
          if (data.data.section_visibility && typeof data.data.section_visibility === 'object') {
            setSectionVisibility(data.data.section_visibility);
          }
          if (data.data.site_titles) {
            const st = data.data.site_titles;
            if (st.heroBadge) setHeroBadge(st.heroBadge);
            if (st.heroTitle) setHeroTitle(st.heroTitle);
            if (st.heroSubtitle) setHeroSubtitle(st.heroSubtitle);
            if (st.vacanciesTitle) setVacanciesTitle(st.vacanciesTitle);
            if (st.vacanciesSubtitle) setVacanciesSubtitle(st.vacanciesSubtitle);
            if (st.hubTitle) setHubTitle(st.hubTitle);
            if (st.hubSubtitle) setHubSubtitle(st.hubSubtitle);
            if (st.officesTitle) setOfficesTitle(st.officesTitle);
            if (st.officesSubtitle) setOfficesSubtitle(st.officesSubtitle);
            if (st.shipownerTitle) setShipownerTitle(st.shipownerTitle);
            if (st.shipownerSubtitle) setShipownerSubtitle(st.shipownerSubtitle);
          }
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
          mergeApiIntoLocal(data.data, setShipownerRequests, 'id', 'request');
        }
      })
      .catch(() => {});
  }, []);

  // Clear stale legacy localStorage overrides so MySQL DB on server is always 100% authoritative
  useEffect(() => {
    try {
      localStorage.removeItem('fleetforce_offices');
      localStorage.removeItem('fleetforce_hub_blocks');
      localStorage.removeItem('fleetforce_stats');
      localStorage.removeItem('fleetforce_vacancies');
    } catch (e) {}
  }, []);

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
    const cleanId = String(id || '').trim();
    if (!cleanId) return;
    const cleanIdLower = cleanId.toLowerCase();

    try {
      const deletedIds = JSON.parse(localStorage.getItem('fleetforce_deleted_request_ids') || '[]');
      const exists = deletedIds.some(x => String(x || '').trim().toLowerCase() === cleanIdLower);
      if (!exists) {
        deletedIds.push(cleanId);
        localStorage.setItem('fleetforce_deleted_request_ids', JSON.stringify(deletedIds));
      }
    } catch (e) {}

    setShipownerRequests((prev) => {
      const updated = prev.filter((r) => String(r.id || '').trim().toLowerCase() !== cleanIdLower);
      try {
        localStorage.setItem('fleetforce_shipowner_requests', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    fetch(`/api/shipowner-requests.php?id=${encodeURIComponent(cleanId)}`, { method: 'DELETE' }).catch(() => {});
    fetch(`/api/shipowner-requests/${encodeURIComponent(cleanId)}`, { method: 'DELETE' }).catch(() => {});
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

    fetch('/api/candidates.php', {
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

  const handleDeleteCandidate = (id) => {
    const cleanId = String(id || '').trim();
    if (!cleanId) return;
    const cleanIdLower = cleanId.toLowerCase();

    try {
      const deletedIds = JSON.parse(localStorage.getItem('fleetforce_deleted_candidate_ids') || '[]');
      const exists = deletedIds.some(x => String(x || '').trim().toLowerCase() === cleanIdLower);
      if (!exists) {
        deletedIds.push(cleanId);
        localStorage.setItem('fleetforce_deleted_candidate_ids', JSON.stringify(deletedIds));
      }
    } catch (e) {}

    setCandidates((prev) => {
      const updated = prev.filter((c) => String(c.id || '').trim().toLowerCase() !== cleanIdLower);
      try {
        localStorage.setItem('fleetforce_candidates', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    fetch(`/api/candidates.php?id=${encodeURIComponent(cleanId)}`, { method: 'DELETE' }).catch(() => {});
    fetch(`/api/candidates/${encodeURIComponent(cleanId)}`, { method: 'DELETE' }).catch(() => {});
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
    const cleanId = String(id || '').trim();
    if (!cleanId) return;
    const cleanIdLower = cleanId.toLowerCase();

    try {
      const deletedIds = JSON.parse(localStorage.getItem('fleetforce_deleted_vacancy_ids') || '[]');
      const exists = deletedIds.some(x => String(x || '').trim().toLowerCase() === cleanIdLower);
      if (!exists) {
        deletedIds.push(cleanId);
        localStorage.setItem('fleetforce_deleted_vacancy_ids', JSON.stringify(deletedIds));
      }
    } catch (e) {}

    setVacancies((prev) => {
      const updated = prev.filter((v) => String(v.id || '').trim().toLowerCase() !== cleanIdLower);
      try {
        localStorage.setItem('fleetforce_vacancies', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    fetch(`/api/vacancies.php?id=${encodeURIComponent(cleanId)}`, { method: 'DELETE' }).catch(() => {});
    fetch(`/api/vacancies/${encodeURIComponent(cleanId)}`, { method: 'DELETE' }).catch(() => {});
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

  // Handle publishing all changes from Visual Draft Editor
  const handlePublishEditorChanges = (publishedData) => {
    if (publishedData.vacancies) setVacancies(publishedData.vacancies);
    if (publishedData.offices) setOffices(publishedData.offices);
    if (publishedData.hubBlocks) setHubBlocks(publishedData.hubBlocks);
    if (publishedData.stats) setStats(publishedData.stats);
    if (publishedData.sectionVisibility) setSectionVisibility(publishedData.sectionVisibility);
    if (publishedData.heroBadge !== undefined) setHeroBadge(publishedData.heroBadge);
    if (publishedData.heroTitle !== undefined) setHeroTitle(publishedData.heroTitle);
    if (publishedData.heroSubtitle !== undefined) setHeroSubtitle(publishedData.heroSubtitle);
    if (publishedData.vacanciesTitle !== undefined) setVacanciesTitle(publishedData.vacanciesTitle);
    if (publishedData.vacanciesSubtitle !== undefined) setVacanciesSubtitle(publishedData.vacanciesSubtitle);
    if (publishedData.hubTitle !== undefined) setHubTitle(publishedData.hubTitle);
    if (publishedData.hubSubtitle !== undefined) setHubSubtitle(publishedData.hubSubtitle);
    if (publishedData.officesTitle !== undefined) setOfficesTitle(publishedData.officesTitle);
    if (publishedData.officesSubtitle !== undefined) setOfficesSubtitle(publishedData.officesSubtitle);
    if (publishedData.shipownerTitle !== undefined) setShipownerTitle(publishedData.shipownerTitle);
    if (publishedData.shipownerSubtitle !== undefined) setShipownerSubtitle(publishedData.shipownerSubtitle);
    if (publishedData.service1Title !== undefined) setService1Title(publishedData.service1Title);
    if (publishedData.service1Desc !== undefined) setService1Desc(publishedData.service1Desc);
    if (publishedData.service2Title !== undefined) setService2Title(publishedData.service2Title);
    if (publishedData.service2Desc !== undefined) setService2Desc(publishedData.service2Desc);
    if (publishedData.service3Title !== undefined) setService3Title(publishedData.service3Title);
    if (publishedData.service3Desc !== undefined) setService3Desc(publishedData.service3Desc);
    if (publishedData.footerBrandDesc !== undefined) setFooterBrandDesc(publishedData.footerBrandDesc);
    if (publishedData.footerCertText !== undefined) setFooterCertText(publishedData.footerCertText);
    if (publishedData.footerCopyright !== undefined) setFooterCopyright(publishedData.footerCopyright);

    // Persist full published state to MySQL Database via /api/config.php
    fetch('/api/config.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offices: publishedData.offices || offices,
        hub_blocks: publishedData.hubBlocks || hubBlocks,
        vacancies: publishedData.vacancies || vacancies,
        stats: publishedData.stats || stats,
        section_visibility: publishedData.sectionVisibility || sectionVisibility,
        site_titles: {
          heroBadge: publishedData.heroBadge ?? heroBadge,
          heroTitle: publishedData.heroTitle ?? heroTitle,
          heroSubtitle: publishedData.heroSubtitle ?? heroSubtitle,
          vacanciesTitle: publishedData.vacanciesTitle ?? vacanciesTitle,
          vacanciesSubtitle: publishedData.vacanciesSubtitle ?? vacanciesSubtitle,
          hubTitle: publishedData.hubTitle ?? hubTitle,
          hubSubtitle: publishedData.hubSubtitle ?? hubSubtitle,
          officesTitle: publishedData.officesTitle ?? officesTitle,
          officesSubtitle: publishedData.officesSubtitle ?? officesSubtitle,
          shipownerTitle: publishedData.shipownerTitle ?? shipownerTitle,
          shipownerSubtitle: publishedData.shipownerSubtitle ?? shipownerSubtitle,
        }
      })
    }).catch(() => {});
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

    if (isSiteEditorOpen) {
      return (
        <SiteEditor
          isOpen={true}
          onClose={() => setIsSiteEditorOpen(false)}
          onPublish={handlePublishEditorChanges}
          liveVacancies={vacancies}
          liveOffices={offices}
          liveHubBlocks={hubBlocks}
          liveStats={stats}
          liveSectionVisibility={sectionVisibility}
          liveShipownerRequests={shipownerRequests}
          liveHeroTitle={heroTitle}
          liveHeroSubtitle={heroSubtitle}
        />
      );
    }

    return (
      <AdminDashboard 
        isOpen={true}
        onClose={handleLogoutAdmin}
        onBackToSite={navigateToMain}
        onOpenSiteEditor={() => setIsSiteEditorOpen(true)}
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
        onDeleteCandidate={handleDeleteCandidate}
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
          customBadge={heroBadge || undefined}
          customTitle={heroTitle || undefined}
          customSubtitle={heroSubtitle || undefined}
        />
      )}

      {/* Vacancy Board */}
      {sectionVisibility.vacancies && (
        <VacancyList 
          vacancies={vacancies}
          searchFilter={searchFilter}
          onApplyVacancy={handleApplyVacancy}
          customTitle={vacanciesTitle || undefined}
          customSubtitle={vacanciesSubtitle || undefined}
        />
      )}

      {/* Seafarer Hub / Downloads */}
      {sectionVisibility.hub && (
        <SeafarerHub 
          onOpenWizard={() => handleOpenWizard('')}
          hubBlocks={hubBlocks}
          customTitle={hubTitle || undefined}
          customSubtitle={hubSubtitle || undefined}
        />
      )}

      {/* Shipowners Services */}
      {sectionVisibility.shipowners && (
        <ShipownerServices 
          onRequestSubmit={handleAddShipownerRequest}
          customTitle={shipownerTitle || undefined}
          customSubtitle={shipownerSubtitle || undefined}
          customCard1Title={service1Title || undefined}
          customCard1Desc={service1Desc || undefined}
          customCard2Title={service2Title || undefined}
          customCard2Desc={service2Desc || undefined}
          customCard3Title={service3Title || undefined}
          customCard3Desc={service3Desc || undefined}
        />
      )}

      {/* Offices & Contact Map */}
      {sectionVisibility.offices && (
        <OfficesAndContacts 
          offices={offices}
          customTitle={officesTitle || undefined}
          customSubtitle={officesSubtitle || undefined}
          customHours={officesHours || undefined}
        />
      )}

      {/* Footer */}
      <Footer 
        onOpenAdmin={handleOpenAdminTrigger}
        customBrandDesc={footerBrandDesc || undefined}
        customCertText={footerCertText || undefined}
        customCopyright={footerCopyright || undefined}
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#fff', background: 'var(--bg-main, #0b1329)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '1rem', fontWeight: 700 }}>Произошла ошибка системы</h2>
          <p style={{ color: 'var(--color-danger, #ef4444)', maxWidth: '600px', margin: '0 auto 2rem auto', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
            {this.state.error?.toString()}
          </p>
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => { this.setState({ hasError: false }); window.location.hash = ''; window.location.reload(); }}
          >
            🔄 Сбросить и вернуться на сайт
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
