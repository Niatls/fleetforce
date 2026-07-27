import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, Briefcase, FileText, Settings, LogOut, Search, Filter, 
  CheckCircle, Clock, AlertTriangle, Eye, Printer, Download, Plus, 
  Trash2, Edit, Save, X, ChevronRight, Anchor, FileCheck, Palette, MapPin, Building, Award, TrendingUp, ArrowLeft
} from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES, getRankLabel, getVesselLabel } from '../../data/initialData';

export const AdminDashboard = ({ 
  isOpen, 
  onClose,
  onBackToSite,
  candidates, 
  vacancies,
  offices = [],
  hubBlocks = [],
  stats = [],
  onUpdateCandidateStatus, 
  onSaveCandidateNotes,
  onAddVacancy,
  onDeleteVacancy,
  onUpdateVacancy,
  onAddOffice,
  onUpdateOffice,
  onDeleteOffice,
  onAddHubBlock,
  onUpdateHubBlock,
  onDeleteHubBlock,
  onUpdateStats
}) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('candidates');

  // Theme State
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('fleetforce_theme') || 'ocean-soft';
  });

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('fleetforce_theme', newTheme);
  };

  // Office State
  const [showOfficeModal, setShowOfficeModal] = useState(false);
  const [editingOfficeId, setEditingOfficeId] = useState(null);
  const [officeForm, setOfficeForm] = useState({
    city: '',
    flag: '🌊 Филиал',
    address: '',
    phone: '',
    email: ''
  });

  const handleOpenAddOffice = () => {
    setEditingOfficeId(null);
    setOfficeForm({
      city: '',
      flag: '🌊 Филиал',
      address: '',
      phone: '',
      email: ''
    });
    setShowOfficeModal(true);
  };

  const handleOpenEditOffice = (off) => {
    setEditingOfficeId(off.id);
    setOfficeForm({
      city: off.city || '',
      flag: off.flag || '⚓ Офис',
      address: off.address || '',
      phone: off.phone || '',
      email: off.email || ''
    });
    setShowOfficeModal(true);
  };

  const handleSaveOffice = (e) => {
    e.preventDefault();
    if (editingOfficeId) {
      if (onUpdateOffice) onUpdateOffice({ ...officeForm, id: editingOfficeId });
    } else {
      if (onAddOffice) onAddOffice({ ...officeForm, id: Date.now() });
    }
    setShowOfficeModal(false);
  };

  // Hub Block State
  const [showHubModal, setShowHubModal] = useState(false);
  const [editingHubId, setEditingHubId] = useState(null);
  const [hubForm, setHubForm] = useState({
    title: '',
    description: '',
    buttonText: '',
    actionType: 'download',
    filename: '',
    fileData: null,
    linkUrl: '',
    iconType: 'FileText',
    color: 'blue'
  });

  const handleHubFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setHubForm((prev) => ({
        ...prev,
        filename: file.name,
        fileData: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddHub = () => {
    setEditingHubId(null);
    setHubForm({
      title: '',
      description: '',
      buttonText: '',
      actionType: 'download',
      filename: '',
      fileData: null,
      linkUrl: '',
      iconType: 'FileText',
      color: 'blue'
    });
    setShowHubModal(true);
  };

  const handleOpenEditHub = (block) => {
    setEditingHubId(block.id);
    setHubForm({
      title: block.title || '',
      description: block.description || '',
      buttonText: block.buttonText || '',
      actionType: block.actionType || 'download',
      filename: block.filename || '',
      fileData: block.fileData || null,
      linkUrl: block.linkUrl || '',
      iconType: block.iconType || 'FileText',
      color: block.color || 'blue'
    });
    setShowHubModal(true);
  };

  const handleSaveHub = (e) => {
    e.preventDefault();
    if (editingHubId) {
      if (onUpdateHubBlock) onUpdateHubBlock({ ...hubForm, id: editingHubId });
    } else {
      if (onAddHubBlock) onAddHubBlock({ ...hubForm, id: Date.now() });
    }
    setShowHubModal(false);
  };

  // Filter States for Candidates
  const [searchCandidate, setSearchCandidate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Vacancy Modal State
  const [showVacancyModal, setShowVacancyModal] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState(null);

  const initialVacancyForm = {
    title: '',
    rank: MARITIME_RANKS[0],
    vesselType: VESSEL_TYPES[0],
    dwt: '47,000 DWT',
    salary: '$8,500',
    contract: '4 months',
    joiningPort: 'Rotterdam, Netherlands',
    joiningDate: '15.08.2026',
    urgent: false,
    active: true,
    requirements: ['Valid STCW Certs', 'Advanced Tanker endorsement'],
    responsibilities: 'Standard rank duties on merchant fleet vessel.'
  };

  const [vacancyForm, setVacancyForm] = useState(initialVacancyForm);

  const handleOpenAddVacancy = () => {
    setEditingVacancyId(null);
    setVacancyForm({
      ...initialVacancyForm,
      title: MARITIME_RANKS[0]
    });
    setShowVacancyModal(true);
  };

  const handleOpenEditVacancy = (vac) => {
    setEditingVacancyId(vac.id);
    setVacancyForm({
      title: vac.title || vac.rank || '',
      rank: vac.rank || MARITIME_RANKS[0],
      vesselType: vac.vesselType || VESSEL_TYPES[0],
      dwt: vac.dwt || '',
      salary: vac.salary || '',
      contract: vac.contract || '',
      joiningPort: vac.joiningPort || '',
      joiningDate: vac.joiningDate || '',
      urgent: !!vac.urgent,
      active: vac.active !== undefined ? vac.active : true,
      requirements: vac.requirements || ['Valid STCW Certs'],
      responsibilities: vac.responsibilities || 'Standard duties'
    });
    setShowVacancyModal(true);
  };

  if (!isOpen) return null;

  // Filter Candidates
  const filteredCandidates = candidates.filter((cand) => {
    if (filterStatus && cand.status !== filterStatus) return false;
    if (filterRank && cand.appliedRank !== filterRank) return false;
    if (searchCandidate) {
      const q = searchCandidate.toLowerCase();
      const nameMatch = cand.fullName?.toLowerCase().includes(q);
      const emailMatch = cand.email?.toLowerCase().includes(q);
      const rankMatch = cand.appliedRank?.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch && !rankMatch) return false;
    }
    return true;
  });

  // Handle Vacancy Submit
  const handleSaveVacancy = (e) => {
    e.preventDefault();
    if (editingVacancyId) {
      if (onUpdateVacancy) {
        onUpdateVacancy({
          ...vacancyForm,
          id: editingVacancyId
        });
      }
    } else {
      if (onAddVacancy) {
        onAddVacancy({
          ...vacancyForm,
          id: Date.now()
        });
      }
    }
    setEditingVacancyId(null);
    setShowVacancyModal(false);
  };

  // Export CSV of Candidates
  const handleExportCSV = () => {
    let csv = 'ID,Full Name,Rank,Status,Email,Phone,Marlins,Ready Date\n';
    candidates.forEach((c) => {
      csv += `"${c.id}","${c.fullName}","${c.appliedRank}","${c.status}","${c.email}","${c.phone}","${c.marlinsScore}","${c.readyDate}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FleetForce_Seafarers_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="admin-page-layout" style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Sticky Header */}
      <header style={{
        background: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(0, 139, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <img src="/favicon.png" alt="FleetForce Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>{t('admin.portalTitle')}</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Управление анкетным фондом моряков и вакансиями флота</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={onBackToSite || onClose} className="btn btn-secondary btn-sm" style={{ color: 'var(--color-accent)' }}>
              <ArrowLeft size={15} /> На главный сайт
            </button>
            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
              <Download size={15} /> Экспорт базы (.CSV)
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ color: 'var(--color-danger)' }}>
              <LogOut size={15} /> {t('admin.logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Theme Switcher Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          padding: '0.75rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <Palette size={18} color="var(--color-accent)" />
            <span>Цветовая схема портала:</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleThemeChange('ocean-soft')}
              className={`btn btn-sm ${currentTheme === 'ocean-soft' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              🌊 Спокойный Океан (Soft Slate)
            </button>
            <button 
              onClick={() => handleThemeChange('light-daylight')}
              className={`btn btn-sm ${currentTheme === 'light-daylight' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              ☀️ Светлая Дневная (Light)
            </button>
            <button 
              onClick={() => handleThemeChange('deep-navy')}
              className={`btn btn-sm ${currentTheme === 'deep-navy' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              🌙 Ночной Тёмный (Classic)
            </button>
            <button 
              onClick={() => handleThemeChange('emerald-sea')}
              className={`btn btn-sm ${currentTheme === 'emerald-sea' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              🌿 Изумрудная Волна (Teal)
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('candidates')}
            className={`btn ${activeTab === 'candidates' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} /> {t('admin.tabCandidates')} ({candidates.length})
          </button>

          <button 
            onClick={() => setActiveTab('vacancies')}
            className={`btn ${activeTab === 'vacancies' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Briefcase size={16} /> {t('admin.tabVacancies')} ({vacancies.length})
          </button>

          <button 
            onClick={() => setActiveTab('offices')}
            className={`btn ${activeTab === 'offices' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Building size={16} /> Филиалы и Офисы ({offices.length})
          </button>

          <button 
            onClick={() => setActiveTab('hub')}
            className={`btn ${activeTab === 'hub' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={16} /> Инфо-Блоки и Бланки ({hubBlocks.length})
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <TrendingUp size={16} /> Счетчики и Показатели ({stats.length})
          </button>
        </div>

        {/* TAB 1: CANDIDATES DATABASE */}
        {activeTab === 'candidates' && (
          <div>
            {/* Candidate Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  placeholder={t('admin.searchCandidate')}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={searchCandidate}
                  onChange={(e) => setSearchCandidate(e.target.value)}
                />
              </div>

              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">{t('admin.filterStatus')}</option>
                <option value="New">{t('admin.statusNew')}</option>
                <option value="Under Review">{t('admin.statusReview')}</option>
                <option value="Approved">{t('admin.statusApproved')}</option>
                <option value="On Board">{t('admin.statusOnBoard')}</option>
                <option value="Archive">{t('admin.statusArchive')}</option>
              </select>

              <select 
                className="form-select"
                value={filterRank}
                onChange={(e) => setFilterRank(e.target.value)}
              >
                <option value="">Все должности</option>
                {MARITIME_RANKS.map((r) => (
                  <option key={r} value={r}>{getRankLabel(r, lang)}</option>
                ))}
              </select>
            </div>

            {/* Candidates Table */}
            <div style={{ overflowX: 'auto', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>ID / {t('admin.colName')}</th>
                    <th style={{ padding: '1rem' }}>{t('admin.colRank')}</th>
                    <th style={{ padding: '1rem' }}>Marlins</th>
                    <th style={{ padding: '1rem' }}>{t('admin.colReadyDate')}</th>
                    <th style={{ padding: '1rem' }}>{t('admin.colStatus')}</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>{t('admin.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((cand) => (
                    <tr key={cand.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{cand.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)' }}>{cand.id} • {cand.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-blue">{cand.appliedRank}</span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-emerald)' }}>
                        {cand.marlinsScore || 'N/A'}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {cand.readyDate}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={cand.status} 
                          onChange={(e) => onUpdateCandidateStatus(cand.id, e.target.value)}
                          className="form-select"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: cand.status === 'Approved' ? 'var(--color-emerald-light)' : 'rgba(255,255,255,0.05)', color: cand.status === 'Approved' ? 'var(--color-emerald)' : 'var(--text-primary)' }}
                        >
                          <option value="New">{t('admin.statusNew')}</option>
                          <option value="Under Review">{t('admin.statusReview')}</option>
                          <option value="Approved">{t('admin.statusApproved')}</option>
                          <option value="On Board">{t('admin.statusOnBoard')}</option>
                          <option value="Archive">{t('admin.statusArchive')}</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => setSelectedCandidate(cand)}
                          className="btn btn-secondary btn-sm"
                          style={{ marginRight: '0.4rem' }}
                        >
                          <Eye size={14} /> {t('admin.viewDossier')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OFFICES MANAGER */}
        {activeTab === 'offices' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Управление Сетью Филиалов и Контактов</h3>
              <button onClick={handleOpenAddOffice} className="btn btn-accent">
                <Plus size={18} /> Добавить Филиал
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {offices.map((off) => (
                <div key={off.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span className="badge badge-blue">{off.flag}</span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        onClick={() => handleOpenEditOffice(off)}
                        style={{ background: 'rgba(0,139,255,0.1)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer', padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Edit size={14} /> <span style={{ fontSize: '0.75rem' }}>Изм.</span>
                      </button>
                      <button 
                        onClick={() => onDeleteOffice && onDeleteOffice(off.id)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '6px', cursor: 'pointer', padding: '0.3rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '0.6rem' }}>{off.city}</h4>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.4rem' }}>
                    <div>📍 {off.address}</div>
                    {off.phone && <div>📞 <strong>{off.phone}</strong></div>}
                    <div>✉️ {off.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HUB BLOCKS MANAGER */}
        {activeTab === 'hub' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Управление Блоками Морякам и Документами</h3>
              <button onClick={handleOpenAddHub} className="btn btn-accent">
                <Plus size={18} /> Добавить Инфо-Блок
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {hubBlocks.map((block) => (
                <div key={block.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <span className="badge badge-gold">{block.actionType ? block.actionType.toUpperCase() : 'BLOCK'}</span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={() => handleOpenEditHub(block)}
                          style={{ background: 'rgba(0,139,255,0.1)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer', padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <Edit size={14} /> <span style={{ fontSize: '0.75rem' }}>Изм.</span>
                        </button>
                        <button 
                          onClick={() => onDeleteHubBlock && onDeleteHubBlock(block.id)}
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '6px', cursor: 'pointer', padding: '0.3rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>{block.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{block.description}</p>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem' }}>
                    Кнопка: <strong>{block.buttonText}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STATS COUNTERS MANAGER */}
        {activeTab === 'stats' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>Управление Главными Счетчиками (Hero Stats)</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Изменяйте цифры и подписи 4 ключевых показателей агентства на главной странице сайта.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {stats.map((st) => (
                <div key={st.id} className="glass-card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Показатель #{st.id}</span>
                    <span className="badge badge-blue">{st.color.toUpperCase()}</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Значение (Число / Текст)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={st.number}
                      onChange={(e) => {
                        const updated = stats.map(s => s.id === st.id ? { ...s, number: e.target.value } : s);
                        if (onUpdateStats) onUpdateStats(updated);
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Подпись (Русский)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={st.labelRu}
                      onChange={(e) => {
                        const updated = stats.map(s => s.id === st.id ? { ...s, labelRu: e.target.value } : s);
                        if (onUpdateStats) onUpdateStats(updated);
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Подпись (English)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={st.labelEn || ''}
                      onChange={(e) => {
                        const updated = stats.map(s => s.id === st.id ? { ...s, labelEn: e.target.value } : s);
                        if (onUpdateStats) onUpdateStats(updated);
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Цветовой акцент</label>
                    <select 
                      className="form-select"
                      value={st.color}
                      onChange={(e) => {
                        const updated = stats.map(s => s.id === st.id ? { ...s, color: e.target.value } : s);
                        if (onUpdateStats) onUpdateStats(updated);
                      }}
                    >
                      <option value="blue">Голубой (Blue)</option>
                      <option value="emerald">Изумрудный (Emerald)</option>
                      <option value="gold">Золотой (Gold)</option>
                      <option value="white">Белый (White)</option>
                      <option value="danger">Красный (Danger)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vacancies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Управление Мобильным Фондом Вакансий</h3>
              <button onClick={handleOpenAddVacancy} className="btn btn-accent">
                <Plus size={18} /> {t('admin.addVacancyBtn')}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {vacancies.map((vac) => (
                <div key={vac.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div>
                      <span className="badge badge-blue">{getVesselLabel(vac.vesselType, lang)}</span>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '0.4rem', color: '#FFFFFF' }}>{vac.title}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button 
                        onClick={() => handleOpenEditVacancy(vac)} 
                        title="Редактировать вакансию"
                        style={{ background: 'rgba(0,139,255,0.1)', border: '1px solid rgba(0,139,255,0.3)', color: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Edit size={14} /> <span style={{ fontSize: '0.8rem' }}>Изм.</span>
                      </button>
                      <button 
                        onClick={() => onDeleteVacancy(vac.id)} 
                        title="Удалить вакансию"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '6px', cursor: 'pointer', padding: '0.35rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-emerald)', marginBottom: '1rem' }}>
                    {vac.salary} / мес
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.4rem' }}>
                    <div>DWT / Двигатель: <strong>{vac.dwt}</strong></div>
                    <div>Контракт: <strong>{vac.contract}</strong></div>
                    <div>Порт посадки: <strong>{vac.joiningPort}</strong></div>
                    <div>Дата готовности: <strong style={{ color: 'var(--color-gold)' }}>{vac.joiningDate}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANDIDATE DOSSIER MODAL */}
        {selectedCandidate && (
          <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
            <div className="modal-content printable-cv" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', padding: '2.5rem' }}>
              
              {/* Screen Modal Actions */}
              <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <FileCheck size={24} color="var(--color-accent)" />
                  <h3 style={{ fontSize: '1.5rem' }}>{t('admin.dossierTitle')} - {selectedCandidate.id}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
                    <Printer size={15} /> {t('admin.exportPdf')}
                  </button>
                  <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Printable Header (Visible on print) */}
              <div className="printable-header-only" style={{ borderBottom: '2px solid #003366', paddingBottom: '10px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', color: '#003366', margin: 0, textTransform: 'uppercase' }}>FleetForce Crewing Alliance</h2>
                    <div style={{ fontSize: '0.85rem', color: '#555' }}>International Seafarer Application Dossier | Ref: {selectedCandidate.id}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#555' }}>
                    Date: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Dossier Body */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.6rem' }}>1. Personal Details / Личные данные</h4>
                  <div style={{ fontSize: '0.9rem', display: 'grid', gap: '0.4rem' }}>
                    <div><strong>Full Name / ФИО:</strong> {selectedCandidate.fullName}</div>
                    <div><strong>Phone / Телефон:</strong> {selectedCandidate.phone}</div>
                    <div><strong>Email / Эл. почта:</strong> {selectedCandidate.email}</div>
                    <div><strong>Citizenship / Гражданство:</strong> {selectedCandidate.citizenship}</div>
                    <div><strong>Date of Birth / Дата рождения:</strong> {selectedCandidate.dob}</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.6rem' }}>2. Position & Qualification / Квалификация</h4>
                  <div style={{ fontSize: '0.9rem', display: 'grid', gap: '0.4rem' }}>
                    <div><strong>Applied Rank / Должность:</strong> {selectedCandidate.appliedRank}</div>
                    <div><strong>Desired Salary / Оклад:</strong> ${selectedCandidate.minSalary} / month</div>
                    <div><strong>Availability / Готовность:</strong> {selectedCandidate.readyDate}</div>
                    <div><strong>Marlins Score / Английский:</strong> {selectedCandidate.marlinsScore} ({selectedCandidate.englishLevel})</div>
                  </div>
                </div>
              </div>

              {/* Sea Experience Matrix */}
              <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.8rem' }}>3. Sea Experience Record Matrix / Опыт работы в море</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.6rem' }}>Vessel Name</th>
                    <th style={{ padding: '0.6rem' }}>Type</th>
                    <th style={{ padding: '0.6rem' }}>DWT / Engine</th>
                    <th style={{ padding: '0.6rem' }}>Rank</th>
                    <th style={{ padding: '0.6rem' }}>Sign On / Off</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCandidate.seaService?.map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>{s.vesselName || 'N/A'}</td>
                      <td style={{ padding: '0.5rem' }}>{s.vesselType}</td>
                      <td style={{ padding: '0.5rem' }}>{s.dwtGrt} / {s.engineBhp}</td>
                      <td style={{ padding: '0.5rem' }}>{s.rankHeld}</td>
                      <td style={{ padding: '0.5rem' }}>{s.dateFrom} — {s.dateTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Attached Candidate Documents */}
              {selectedCandidate.attachedFiles && selectedCandidate.attachedFiles.length > 0 && (
                <div style={{ marginBottom: '1.5rem', background: 'rgba(0,139,255,0.06)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,139,255,0.25)' }}>
                  <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={18} /> 4. Attached Documents / Прикрепленные файлы ({selectedCandidate.attachedFiles.length})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
                    {selectedCandidate.attachedFiles.map((file, fIdx) => (
                      <div key={file.id || fIdx} style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{file.size || 'FILE'}</div>
                        </div>
                        <a 
                          href={file.dataUrl} 
                          download={file.name} 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', flexShrink: 0, textDecoration: 'none' }}
                        >
                          <Download size={13} /> Скачать
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manager Notes */}
              <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>{t('admin.recruiterNotes')}</h4>
                <textarea 
                  className="form-textarea"
                  style={{ height: '80px', marginBottom: '0.8rem' }}
                  defaultValue={selectedCandidate.notes || ''}
                  onBlur={(e) => onSaveCandidateNotes(selectedCandidate.id, e.target.value)}
                />
              </div>

            </div>
          </div>
        )}

        {/* CREATE / EDIT VACANCY MODAL */}
        {showVacancyModal && (
          <div className="modal-overlay" onClick={() => setShowVacancyModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
                  {editingVacancyId ? 'Редактировать Вакансию' : t('admin.addVacancyBtn')}
                </h3>
                <button onClick={() => setShowVacancyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveVacancy} style={{ display: 'grid', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Заголовок вакансии</label>
                  <input 
                    type="text" 
                    required
                    placeholder={t('admin.vacTitle')}
                    className="form-input"
                    value={vacancyForm.title}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Должность</label>
                    <select 
                      className="form-select"
                      value={vacancyForm.rank}
                      onChange={(e) => setVacancyForm({ ...vacancyForm, rank: e.target.value })}
                    >
                      {MARITIME_RANKS.map((r) => (
                        <option key={r} value={r}>{getRankLabel(r, lang)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Тип судна</label>
                    <select 
                      className="form-select"
                      value={vacancyForm.vesselType}
                      onChange={(e) => setVacancyForm({ ...vacancyForm, vesselType: e.target.value })}
                    >
                      {VESSEL_TYPES.map((v) => (
                        <option key={v} value={v}>{getVesselLabel(v, lang)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Оклад ($ / мес)</label>
                    <input 
                      type="text" 
                      placeholder="Оклад (e.g. $12,500)"
                      className="form-input"
                      value={vacancyForm.salary}
                      onChange={(e) => setVacancyForm({ ...vacancyForm, salary: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Длительность контракта</label>
                    <input 
                      type="text" 
                      placeholder="Контракт (e.g. 4 months)"
                      className="form-input"
                      value={vacancyForm.contract}
                      onChange={(e) => setVacancyForm({ ...vacancyForm, contract: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">DWT / Двигатель</label>
                    <input 
                      type="text" 
                      placeholder="47,000 DWT (MAN B&W)"
                      className="form-input"
                      value={vacancyForm.dwt}
                      onChange={(e) => setVacancyForm({ ...vacancyForm, dwt: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Порт посадки</label>
                    <input 
                      type="text" 
                      placeholder="Роттердам, Нидерланды"
                      className="form-input"
                      value={vacancyForm.joiningPort}
                      onChange={(e) => setVacancyForm({ ...vacancyForm, joiningPort: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Дата готовности</label>
                  <input 
                    type="text" 
                    placeholder="15.08.2026"
                    className="form-input"
                    value={vacancyForm.joiningDate}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, joiningDate: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={vacancyForm.urgent}
                      onChange={(e) => setVacancyForm({ ...vacancyForm, urgent: e.target.checked })}
                    />
                    <span style={{ color: vacancyForm.urgent ? 'var(--color-danger)' : 'var(--text-primary)', fontWeight: 600 }}>Пометить как СРОЧНАЯ! (HOT)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowVacancyModal(false)} className="btn btn-secondary">
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-accent">
                    {editingVacancyId ? 'Сохранить изменения' : t('admin.saveVacBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE / EDIT OFFICE MODAL */}
        {showOfficeModal && (
          <div className="modal-overlay" onClick={() => setShowOfficeModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
                  {editingOfficeId ? 'Редактировать Филиал' : 'Добавить Новый Филиал'}
                </h3>
                <button onClick={() => setShowOfficeModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveOffice} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Город / Регион</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Санкт-Петербург"
                      className="form-input"
                      value={officeForm.city}
                      onChange={(e) => setOfficeForm({ ...officeForm, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Бейдж / Метка</label>
                    <input 
                      type="text" 
                      placeholder="⚓ Главный Офис"
                      className="form-input"
                      value={officeForm.flag}
                      onChange={(e) => setOfficeForm({ ...officeForm, flag: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Адрес офиса</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Набережная Реки Мойки 58, Офис 402"
                    className="form-input"
                    value={officeForm.address}
                    onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Телефон (необязательно)</label>
                    <input 
                      type="text" 
                      placeholder="+7 (812) 334-55-66 (необязательно)"
                      className="form-input"
                      value={officeForm.phone}
                      onChange={(e) => setOfficeForm({ ...officeForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="spb@fleetforce-crewing.com"
                      className="form-input"
                      value={officeForm.email}
                      onChange={(e) => setOfficeForm({ ...officeForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowOfficeModal(false)} className="btn btn-secondary">
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Сохранить Филиал
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE / EDIT HUB BLOCK MODAL */}
        {showHubModal && (
          <div className="modal-overlay" onClick={() => setShowHubModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
                  {editingHubId ? 'Редактировать Инфо-Блок' : 'Добавить Новый Инфо-Блок'}
                </h3>
                <button onClick={() => setShowHubModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveHub} style={{ display: 'grid', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Заголовок блока</label>
                  <input 
                    type="text" 
                    required
                    placeholder="BGI Standard Application"
                    className="form-input"
                    value={hubForm.title}
                    onChange={(e) => setHubForm({ ...hubForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Описание блока</label>
                  <textarea 
                    className="form-textarea"
                    style={{ height: '75px' }}
                    placeholder="Описание бланка или услуги..."
                    value={hubForm.description}
                    onChange={(e) => setHubForm({ ...hubForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Текст на кнопке</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Скачать анкету BGI (.DOCX)"
                      className="form-input"
                      value={hubForm.buttonText}
                      onChange={(e) => setHubForm({ ...hubForm, buttonText: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Тип действия кнопки</label>
                    <select 
                      className="form-select"
                      value={hubForm.actionType}
                      onChange={(e) => setHubForm({ ...hubForm, actionType: e.target.value })}
                    >
                      <option value="download">Скачивание файла (download)</option>
                      <option value="wizard">Открыть Мастер Анкеты (wizard)</option>
                      <option value="link">Переход по ссылке / Телефон (link)</option>
                    </select>
                  </div>
                </div>

                {hubForm.actionType === 'download' && (
                  <div style={{ display: 'grid', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ color: 'var(--color-accent)' }}>📎 Загрузить файл с компьютера (.docx, .pdf, .zip, .xlsx)</label>
                      <input 
                        type="file" 
                        onChange={handleHubFileSelect}
                        className="form-input"
                        style={{ padding: '0.5rem', cursor: 'pointer' }}
                      />
                    </div>

                    {hubForm.fileData && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-emerald)', background: 'var(--color-emerald-light)', padding: '0.5rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <CheckCircle size={15} /> Файл прикреплен и готов к скачиванию: <strong>{hubForm.filename}</strong>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Имя файла при сохранении пользователем</label>
                      <input 
                        type="text" 
                        placeholder="BGI_Application_Form_2026.docx"
                        className="form-input"
                        value={hubForm.filename}
                        onChange={(e) => setHubForm({ ...hubForm, filename: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {hubForm.actionType === 'link' && (
                  <div className="form-group">
                    <label className="form-label">Ссылка / Телефон (tel:)</label>
                    <input 
                      type="text" 
                      placeholder="tel:+78005553535"
                      className="form-input"
                      value={hubForm.linkUrl}
                      onChange={(e) => setHubForm({ ...hubForm, linkUrl: e.target.value })}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div className="form-group">
                    <label className="form-label">Тип иконки</label>
                    <select 
                      className="form-select"
                      value={hubForm.iconType}
                      onChange={(e) => setHubForm({ ...hubForm, iconType: e.target.value })}
                    >
                      <option value="FileText">FileText (Документ)</option>
                      <option value="Download">Download (Скачивание)</option>
                      <option value="FileCheck">FileCheck (Галочка / Чек-лист)</option>
                      <option value="Award">Award (Награда / Тесты)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Цветовой акцент</label>
                    <select 
                      className="form-select"
                      value={hubForm.color}
                      onChange={(e) => setHubForm({ ...hubForm, color: e.target.value })}
                    >
                      <option value="blue">Синий (Blue)</option>
                      <option value="gold">Золотой (Gold)</option>
                      <option value="emerald">Изумрудный (Emerald)</option>
                      <option value="danger">Красный (Danger)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowHubModal(false)} className="btn btn-secondary">
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-accent">
                    Сохранить Инфо-Блок
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Admin Page Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.2rem 2rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-surface)'
      }}>
        FleetForce Crewing Admin Panel • MLC 2006 & ISO 9001 Certified System
      </footer>
    </div>
  );
};
