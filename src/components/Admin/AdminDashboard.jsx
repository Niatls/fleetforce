import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, Briefcase, FileText, Settings, LogOut, Eye, EyeOff, 
  Download, Anchor, Palette, MapPin, TrendingUp, ArrowLeft, Mail, Edit3, Layout
} from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES } from '../../data/initialData';

// Import Modular Tabs & Modals
import { CandidatesTab } from './CandidatesTab';
import { VacanciesTab } from './VacanciesTab';
import { OfficesTab } from './OfficesTab';
import { HubBlocksTab } from './HubBlocksTab';
import { HeroStatsTab } from './HeroStatsTab';
import { ShipownerRequestsTab } from './ShipownerRequestsTab';
import { CandidateDossierModal } from './CandidateDossierModal';
import { VacancyFormModal } from './VacancyFormModal';
import { OfficeFormModal } from './OfficeFormModal';
import { HubBlockFormModal } from './HubBlockFormModal';
import { ShipownerRequestModal } from './ShipownerRequestModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { handleExportCSV, handleExportDoc, handleExportPdf } from './exportUtils';

export const AdminDashboard = ({ 
  isOpen, 
  onClose,
  onBackToSite,
  onOpenSiteEditor,
  candidates = [], 
  vacancies = [],
  offices = [],
  hubBlocks = [],
  stats = [],
  shipownerRequests = [],
  sectionVisibility = { hero: true, vacancies: true, hub: true, shipowners: true, offices: true },
  onToggleSectionVisibility,
  onToggleVacancyActive,
  onToggleOfficeActive,
  onToggleHubBlockActive,
  onUpdateCandidateStatus, 
  onDeleteCandidate,
  onSaveCandidateNotes,
  onUpdateCandidateFiles,
  onAddVacancy,
  onDeleteVacancy,
  onUpdateVacancy,
  onAddOffice,
  onUpdateOffice,
  onDeleteOffice,
  onAddHubBlock,
  onUpdateHubBlock,
  onDeleteHubBlock,
  onUpdateStats,
  onUpdateShipownerRequestStatus,
  onDeleteShipownerRequest
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('candidates');

  // Theme State
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('fleetforce_theme') || 'ocean-soft';
  });

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('fleetforce_theme', newTheme);
  };

  // Office Modal State
  const [showOfficeModal, setShowOfficeModal] = useState(false);
  const [editingOfficeId, setEditingOfficeId] = useState(null);
  const [officeForm, setOfficeForm] = useState({ city: '', flag: '🌊 Филиал', address: '', phone: '', email: '' });

  const handleOpenAddOffice = () => {
    setEditingOfficeId(null);
    setOfficeForm({ city: '', flag: '🌊 Филиал', address: '', phone: '', email: '' });
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

  const handleSaveOffice = (savedOffice) => {
    const data = (savedOffice && typeof savedOffice === 'object' && savedOffice.city) ? savedOffice : officeForm;
    if (editingOfficeId || data.id) {
      if (onUpdateOffice) onUpdateOffice({ ...data, id: editingOfficeId || data.id });
    } else {
      if (onAddOffice) onAddOffice({ ...data, id: Date.now() });
    }
    setShowOfficeModal(false);
  };

  // Hub Block Modal State
  const [showHubModal, setShowHubModal] = useState(false);
  const [editingHubId, setEditingHubId] = useState(null);
  const [hubForm, setHubForm] = useState({
    title: '', description: '', buttonText: '', actionType: 'download', filename: '', fileData: null, linkUrl: '', iconType: 'FileText', color: 'blue'
  });

  const handleHubFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setHubForm((prev) => ({ ...prev, filename: file.name, fileData: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddHub = () => {
    setEditingHubId(null);
    setHubForm({ title: '', description: '', buttonText: '', actionType: 'download', filename: '', fileData: null, linkUrl: '', iconType: 'FileText', color: 'blue' });
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

  const handleSaveHub = (savedHub) => {
    const data = (savedHub && typeof savedHub === 'object' && savedHub.title) ? savedHub : hubForm;
    if (editingHubId || data.id) {
      if (onUpdateHubBlock) onUpdateHubBlock({ ...data, id: editingHubId || data.id });
    } else {
      if (onAddHubBlock) onAddHubBlock({ ...data, id: Date.now() });
    }
    setShowHubModal(false);
  };

  // Candidates & Files Filter State
  const [searchCandidate, setSearchCandidate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedShipownerRequest, setSelectedShipownerRequest] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFileAllFiles, setPreviewFileAllFiles] = useState([]);
  const [previewFileIndex, setPreviewFileIndex] = useState(0);

  const openFilePreview = (file, allFiles = []) => {
    const idx = allFiles.indexOf(file);
    setPreviewFile(file);
    setPreviewFileAllFiles(allFiles);
    setPreviewFileIndex(idx >= 0 ? idx : 0);
  };

  const navigatePreviewFile = (newIndex) => {
    if (!previewFileAllFiles || newIndex < 0 || newIndex >= previewFileAllFiles.length) return;
    setPreviewFile(previewFileAllFiles[newIndex]);
    setPreviewFileIndex(newIndex);
  };

  const handleAdminFileUpload = (candidateId, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const cand = candidates.find((c) => c.id === candidateId);
    const existingFiles = cand?.attachedFiles || [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileObj = {
          id: 'adm-' + Date.now() + Math.random(),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type || file.name.split('.').pop(),
          dataUrl: event.target.result
        };
        const updatedFiles = [...existingFiles, fileObj];
        if (onUpdateCandidateFiles) onUpdateCandidateFiles(candidateId, updatedFiles);
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate((prev) => ({ ...prev, attachedFiles: updatedFiles }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAdminFileDelete = (candidateId, fileId) => {
    const cand = candidates.find((c) => c.id === candidateId);
    const updatedFiles = (cand?.attachedFiles || []).filter((f) => f.id !== fileId);
    if (onUpdateCandidateFiles) onUpdateCandidateFiles(candidateId, updatedFiles);
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, attachedFiles: updatedFiles }));
    }
  };

  // Vacancy Modal State
  const [showVacancyModal, setShowVacancyModal] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState(null);
  const initialVacancyForm = {
    title: '', rank: MARITIME_RANKS[0], vesselType: VESSEL_TYPES[0], dwt: '47,000 DWT', salary: '$8,500', contract: '4 months', joiningPort: 'Rotterdam, Netherlands', joiningDate: '15.08.2026', urgent: false, active: true, requirements: ['Valid STCW Certs'], responsibilities: 'Standard rank duties.'
  };
  const [vacancyForm, setVacancyForm] = useState(initialVacancyForm);

  const handleOpenAddVacancy = () => {
    setEditingVacancyId(null);
    setVacancyForm({ ...initialVacancyForm, title: MARITIME_RANKS[0] });
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

  const handleSaveVacancy = (savedVacancy) => {
    const data = (savedVacancy && typeof savedVacancy === 'object' && (savedVacancy.title || savedVacancy.rank)) ? savedVacancy : vacancyForm;
    if (editingVacancyId || data.id) {
      if (onUpdateVacancy) onUpdateVacancy({ ...data, id: editingVacancyId || data.id });
    } else {
      if (onAddVacancy) onAddVacancy({ ...data, id: Date.now() });
    }
    setEditingVacancyId(null);
    setShowVacancyModal(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Admin Top Navigation Bar */}
      <header style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button onClick={onBackToSite || onClose} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            <ArrowLeft size={16} /> {t('admin.backToSite') === 'admin.backToSite' ? '← Вернуться на сайт' : t('admin.backToSite')}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 0 12px rgba(0,139,255,0.3)' }}>
              <img src="/favicon.png" alt="FleetForce Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>FleetForce Admin</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Панель управления крюингового агентства</div>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Theme Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.15)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Palette size={14} color="var(--color-accent)" />
            <select 
              value={currentTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="form-select"
              style={{ padding: '0.2rem 0.4rem', fontSize: '0.78rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="ocean-soft" style={{ background: '#1e293b', color: '#fff' }}>🌊 Тихий Океан (Pacific Blue)</option>
              <option value="light-daylight" style={{ background: '#ffffff', color: '#0f172a' }}>☀️ Дневной Порт (Light Daylight)</option>
              <option value="deep-navy" style={{ background: '#0e1b33', color: '#fff' }}>⚓ Полуночный Флот (Midnight Navy)</option>
              <option value="emerald-sea" style={{ background: '#0a3338', color: '#fff' }}>🐬 Изумрудный Бриз (Caribbean Teal)</option>
              <option value="nordic-storm" style={{ background: '#172338', color: '#fff' }}>⚡ Северный Шторм (Nordic Steel)</option>
              <option value="sunset-haven" style={{ background: '#1e1b3a', color: '#fff' }}>🌅 Морской Закат (Sunset Haven)</option>
            </select>
          </div>

          <button onClick={() => handleExportCSV(candidates)} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <Download size={15} /> Экспорт анкет (.CSV)
          </button>
          
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <LogOut size={15} /> {t('admin.exitBtn') === 'admin.exitBtn' ? 'Выйти из системы' : t('admin.exitBtn')}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>

        {/* Visual Editor Quick Launcher Banner */}
        <div 
          onClick={() => onOpenSiteEditor && onOpenSiteEditor()}
          className="glass-card" 
          style={{ 
            padding: '1.2rem 1.6rem', 
            marginBottom: '1.8rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            background: 'linear-gradient(135deg, rgba(0,139,255,0.18) 0%, rgba(15,23,42,0.85) 100%)', 
            border: '1px solid var(--color-accent)', 
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0,139,255,0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #008BFF 0%, #0056B3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 12px rgba(0,139,255,0.4)' }}>
              <Edit3 size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
                🎨 Визуальный редактор главной страницы (Live Draft Editor)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                Редактируйте тексты, карточки и блоки прямо на копии сайта с безопасным сохранением и кнопкой «Опубликовать».
              </p>
            </div>
          </div>
          <button 
            className="btn btn-primary btn-md"
            style={{ 
              fontWeight: 700, 
              gap: '0.5rem', 
              flexShrink: 0,
              background: 'linear-gradient(135deg, #008BFF 0%, #0056B3 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 15px rgba(0,139,255,0.4)'
            }}
          >
            <span>Открыть редактор сайта</span>
            <Layout size={16} />
          </button>
        </div>

        {/* Section Visibility Toggles Header Bar */}
        <div className="glass-card" style={{ padding: '1rem 1.4rem', marginBottom: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={18} color="var(--color-accent)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>Управление видимостью блоков на Главном Сайте:</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[
              { key: 'hero', label: 'Цифры (Hero)' },
              { key: 'vacancies', label: 'Вакансии' },
              { key: 'hub', label: 'Морякам' },
              { key: 'shipowners', label: 'Судовладельцам' },
              { key: 'offices', label: 'Контакты' }
            ].map((sec) => {
              const isVisible = sectionVisibility[sec.key] !== false;
              return (
                <button
                  key={sec.key}
                  onClick={() => onToggleSectionVisibility && onToggleSectionVisibility(sec.key)}
                  className="btn btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.35rem 0.7rem',
                    background: isVisible ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    border: `1px solid ${isVisible ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: isVisible ? 'var(--color-emerald)' : 'var(--color-danger)',
                    gap: '0.3rem'
                  }}
                >
                  {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                  {sec.label}: {isVisible ? 'Вкл' : 'Выкл'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.8rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          {[
            { id: 'candidates', label: `${t('admin.tabCandidates')} (${candidates.length})`, icon: Users },
            { id: 'vacancies', label: `Вакансии (${vacancies.length})`, icon: Briefcase },
            { id: 'offices', label: `Филиалы (${offices.length})`, icon: MapPin },
            { id: 'hub', label: `Бланки Морякам (${hubBlocks.length})`, icon: Anchor },
            { id: 'heroStats', label: 'Счетчики (Hero)', icon: TrendingUp },
            { id: 'shipownerRequests', label: `Заявки Судовладельцев (${shipownerRequests.length})`, icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'var(--color-accent-light)' : 'transparent',
                  color: isActive ? 'var(--color-accent)' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                  padding: '0.8rem 1.2rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        {activeTab === 'candidates' && (
          <CandidatesTab 
            candidates={candidates}
            searchCandidate={searchCandidate}
            setSearchCandidate={setSearchCandidate}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterRank={filterRank}
            setFilterRank={setFilterRank}
            onUpdateCandidateStatus={onUpdateCandidateStatus}
            onDeleteCandidate={onDeleteCandidate}
            onSelectCandidate={setSelectedCandidate}
            onExportDoc={handleExportDoc}
            onExportPdf={handleExportPdf}
            onPreviewFile={(file) => openFilePreview(file, [])}
          />
        )}

        {activeTab === 'vacancies' && (
          <VacanciesTab 
            vacancies={vacancies}
            onOpenAddVacancy={handleOpenAddVacancy}
            onOpenEditVacancy={handleOpenEditVacancy}
            onToggleVacancyActive={onToggleVacancyActive}
            onDeleteVacancy={onDeleteVacancy}
          />
        )}

        {activeTab === 'offices' && (
          <OfficesTab 
            offices={offices}
            onOpenAddOffice={handleOpenAddOffice}
            onOpenEditOffice={handleOpenEditOffice}
            onToggleOfficeActive={onToggleOfficeActive}
            onDeleteOffice={onDeleteOffice}
          />
        )}

        {activeTab === 'hub' && (
          <HubBlocksTab 
            hubBlocks={hubBlocks}
            onOpenAddHub={handleOpenAddHub}
            onOpenEditHub={handleOpenEditHub}
            onToggleHubBlockActive={onToggleHubBlockActive}
            onDeleteHubBlock={onDeleteHubBlock}
          />
        )}

        {activeTab === 'heroStats' && (
          <HeroStatsTab 
            stats={stats}
            onUpdateStats={onUpdateStats}
          />
        )}

        {activeTab === 'shipownerRequests' && (
          <ShipownerRequestsTab 
            shipownerRequests={shipownerRequests}
            onSelectShipownerRequest={setSelectedShipownerRequest}
            onUpdateShipownerRequestStatus={onUpdateShipownerRequestStatus}
            onDeleteShipownerRequest={onDeleteShipownerRequest}
          />
        )}

        {/* MODALS */}
        <CandidateDossierModal 
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onExportDoc={handleExportDoc}
          onExportPdf={handleExportPdf}
          onDeleteCandidate={onDeleteCandidate}
          onAdminFileUpload={handleAdminFileUpload}
          onAdminFileDelete={handleAdminFileDelete}
          onPreviewFile={(file) => openFilePreview(file, selectedCandidate?.attachedFiles || [])}
          onSaveCandidateNotes={onSaveCandidateNotes}
        />

        <VacancyFormModal 
          isOpen={showVacancyModal}
          editingVacancyId={editingVacancyId}
          vacancyForm={vacancyForm}
          setVacancyForm={setVacancyForm}
          onClose={() => setShowVacancyModal(false)}
          onSave={handleSaveVacancy}
        />

        <OfficeFormModal 
          isOpen={showOfficeModal}
          editingOfficeId={editingOfficeId}
          officeForm={officeForm}
          setOfficeForm={setOfficeForm}
          onClose={() => setShowOfficeModal(false)}
          onSave={handleSaveOffice}
        />

        <HubBlockFormModal 
          isOpen={showHubModal}
          editingHubId={editingHubId}
          hubForm={hubForm}
          setHubForm={setHubForm}
          onHubFileSelect={handleHubFileSelect}
          onClose={() => setShowHubModal(false)}
          onSave={handleSaveHub}
        />

        <ShipownerRequestModal 
          request={selectedShipownerRequest}
          onClose={() => setSelectedShipownerRequest(null)}
        />

        <DocumentPreviewModal 
          previewFile={previewFile}
          allFiles={previewFileAllFiles}
          currentIndex={previewFileIndex}
          onNavigate={navigatePreviewFile}
          onClose={() => setPreviewFile(null)}
        />

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
