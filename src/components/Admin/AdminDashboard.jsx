import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, Briefcase, FileText, Settings, LogOut, Search, Filter, 
  CheckCircle, Clock, AlertTriangle, Eye, Printer, Download, Plus, 
  Trash2, Edit, Save, X, ChevronRight, Anchor, FileCheck, Palette
} from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES, getRankLabel, getVesselLabel } from '../../data/initialData';

export const AdminDashboard = ({ 
  isOpen, 
  onClose, 
  candidates, 
  vacancies, 
  onUpdateCandidateStatus, 
  onSaveCandidateNotes,
  onAddVacancy,
  onDeleteVacancy,
  onUpdateVacancy
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
    <div className="modal-overlay" style={{ overflowY: 'auto' }}>
      <div className="modal-content" style={{ maxWidth: '1180px', padding: '2rem', minHeight: '85vh' }}>
        
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
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
              <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF' }}>{t('admin.portalTitle')}</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Управление анкетным фондом моряков и вакансиями флота</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
              <Download size={15} /> Экспорт базы (.CSV)
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ color: 'var(--color-danger)' }}>
              <LogOut size={15} /> {t('admin.logout')}
            </button>
          </div>
        </div>

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
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
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

        {/* TAB 2: VACANCY MANAGER */}
        {activeTab === 'vacancies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Управление Мобильным Фондом Вакансий</h3>
              <button onClick={() => setShowVacancyModal(true)} className="btn btn-accent">
                <Plus size={18} /> {t('admin.addVacancyBtn')}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {vacancies.map((vac) => (
                <div key={vac.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div>
                      <span className="badge badge-blue">{vac.vesselType}</span>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '0.4rem', color: '#FFFFFF' }}>{vac.title}</h4>
                    </div>
                    <button onClick={() => onDeleteVacancy(vac.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-emerald)', marginBottom: '1rem' }}>
                    {vac.salary} / мес
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.4rem' }}>
                    <div>DWT / Двигатель: <strong>{vac.dwt}</strong></div>
                    <div>Контракт: <strong>{vac.contract}</strong></div>
                    <div>Порт посадки: <strong>{vac.joiningPort}</strong></div>
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

      </div>
    </div>
  );
};
