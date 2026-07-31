import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft, Rocket, RefreshCw, Eye, EyeOff, Plus, CheckCircle2,
  AlertCircle, Sparkles, Layout, Settings, Edit3, Layers, Anchor
} from 'lucide-react';

import { Hero } from '../Hero';
import { VacancyList } from '../VacancyList';
import { SeafarerHub } from '../SeafarerHub';
import { ShipownerServices } from '../ShipownerServices';
import { OfficesAndContacts } from '../OfficesAndContacts';

import { EditOverlay } from './EditOverlay';
import { InlineText } from './InlineText';
import { VacancyFormModal } from './VacancyFormModal';
import { OfficeFormModal } from './OfficeFormModal';
import { HubBlockFormModal } from './HubBlockFormModal';

export const SiteEditor = ({
  isOpen,
  onClose,
  onPublish,
  liveVacancies = [],
  liveOffices = [],
  liveHubBlocks = [],
  liveStats = [],
  liveSectionVisibility = {},
  liveShipownerRequests = [],
  liveHeroTitle = '',
  liveHeroSubtitle = ''
}) => {
  const { lang, t } = useLanguage();

  // Draft State (initialized with current live data)
  const [draftVacancies, setDraftVacancies] = useState([]);
  const [draftOffices, setDraftOffices] = useState([]);
  const [draftHubBlocks, setDraftHubBlocks] = useState([]);
  const [draftStats, setDraftStats] = useState([]);
  const [draftSectionVisibility, setDraftSectionVisibility] = useState({});

  // Hero custom text state (persisted in draft/local)
  const [draftHeroTitle, setDraftHeroTitle] = useState(liveHeroTitle || 'Трудоустройство моряков на мировой торговый флот');
  const [draftHeroSubtitle, setDraftHeroSubtitle] = useState(liveHeroSubtitle || 'Официальное трудоустройство, высокие ставки, стабильные контракты на танкерном, контейнерном, балкерном и офшорном флоте.');

  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Modals state inside editor
  const [vacancyModalOpen, setVacancyModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);

  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);

  const [hubModalOpen, setHubModalOpen] = useState(false);
  const [editingHubBlock, setEditingHubBlock] = useState(null);

  // Initialize draft when editor opens
  useEffect(() => {
    if (isOpen) {
      setDraftVacancies(JSON.parse(JSON.stringify(liveVacancies)));
      setDraftOffices(JSON.parse(JSON.stringify(liveOffices)));
      setDraftHubBlocks(JSON.parse(JSON.stringify(liveHubBlocks)));
      setDraftStats(JSON.parse(JSON.stringify(liveStats)));
      setDraftSectionVisibility(JSON.parse(JSON.stringify(liveSectionVisibility)));
      setDraftHeroTitle(liveHeroTitle || 'Трудоустройство моряков на мировой торговый флот');
      setDraftHeroSubtitle(liveHeroSubtitle || 'Официальное трудоустройство, высокие ставки, стабильные контракты на танкерном, контейнерном, балкерном и офшорном флоте.');
      setHasChanges(false);
    }
  }, [isOpen, liveVacancies, liveOffices, liveHubBlocks, liveStats, liveSectionVisibility, liveHeroTitle, liveHeroSubtitle]);

  // Track if changes exist compared to live
  const markChanged = () => setHasChanges(true);

  if (!isOpen) return null;

  // Reset draft to current live state
  const handleResetDraft = () => {
    if (window.confirm('Сбросить все несохранённые изменения в черновике и вернуть исходное состояние сайта?')) {
      setDraftVacancies(JSON.parse(JSON.stringify(liveVacancies)));
      setDraftOffices(JSON.parse(JSON.stringify(liveOffices)));
      setDraftHubBlocks(JSON.parse(JSON.stringify(liveHubBlocks)));
      setDraftStats(JSON.parse(JSON.stringify(liveStats)));
      setDraftSectionVisibility(JSON.parse(JSON.stringify(liveSectionVisibility)));
      setDraftHeroTitle(liveHeroTitle || 'Трудоустройство моряков на мировой торговый флот');
      setDraftHeroSubtitle(liveHeroSubtitle || 'Официальное трудоустройство, высокие ставки, стабильные контракты на танкерном, контейнерном, балкерном и офшорном флоте.');
      setHasChanges(false);
    }
  };

  // Publish Draft -> Live
  const handlePublishAll = () => {
    onPublish({
      vacancies: draftVacancies,
      offices: draftOffices,
      hubBlocks: draftHubBlocks,
      stats: draftStats,
      sectionVisibility: draftSectionVisibility,
      heroTitle: draftHeroTitle,
      heroSubtitle: draftHeroSubtitle
    });

    setHasChanges(false);
    alert('🚀 Поздравляем! Все изменения из черновика успешно опубликованы на главном сайте!');
  };

  // --- Handlers for Vacancies ---
  const handleOpenAddVacancy = () => {
    setEditingVacancy(null);
    setVacancyModalOpen(true);
  };
  const handleOpenEditVacancy = (vac) => {
    setEditingVacancy(vac);
    setVacancyModalOpen(true);
  };
  const handleSaveVacancyModal = (vacData) => {
    if (editingVacancy) {
      setDraftVacancies(prev => prev.map(v => v.id === vacData.id ? vacData : v));
    } else {
      setDraftVacancies(prev => [vacData, ...prev]);
    }
    markChanged();
    setVacancyModalOpen(false);
  };
  const handleDeleteVacancy = (id) => {
    setDraftVacancies(prev => prev.filter(v => v.id !== id));
    markChanged();
  };
  const handleToggleVacancyActive = (id) => {
    setDraftVacancies(prev => prev.map(v => v.id === id ? { ...v, active: v.active === false } : v));
    markChanged();
  };

  // --- Handlers for Offices ---
  const handleOpenAddOffice = () => {
    setEditingOffice(null);
    setOfficeModalOpen(true);
  };
  const handleOpenEditOffice = (off) => {
    setEditingOffice(off);
    setOfficeModalOpen(true);
  };
  const handleSaveOfficeModal = (offData) => {
    if (editingOffice) {
      setDraftOffices(prev => prev.map(o => o.id === offData.id ? offData : o));
    } else {
      setDraftOffices(prev => [...prev, offData]);
    }
    markChanged();
    setOfficeModalOpen(false);
  };
  const handleDeleteOffice = (id) => {
    setDraftOffices(prev => prev.filter(o => o.id !== id));
    markChanged();
  };
  const handleToggleOfficeActive = (id) => {
    setDraftOffices(prev => prev.map(o => o.id === id ? { ...o, active: o.active === false } : v));
    markChanged();
  };

  // --- Handlers for Hub Blocks ---
  const handleOpenAddHub = () => {
    setEditingHubBlock(null);
    setHubModalOpen(true);
  };
  const handleOpenEditHub = (block) => {
    setEditingHubBlock(block);
    setHubModalOpen(true);
  };
  const handleSaveHubModal = (hubData) => {
    if (editingHubBlock) {
      setDraftHubBlocks(prev => prev.map(b => b.id === hubData.id ? hubData : b));
    } else {
      setDraftHubBlocks(prev => [...prev, hubData]);
    }
    markChanged();
    setHubModalOpen(false);
  };
  const handleDeleteHubBlock = (id) => {
    setDraftHubBlocks(prev => prev.filter(b => b.id !== id));
    markChanged();
  };
  const handleToggleHubActive = (id) => {
    setDraftHubBlocks(prev => prev.map(b => b.id === id ? { ...b, active: b.active === false } : b));
    markChanged();
  };

  // --- Handlers for Section Visibility ---
  const handleToggleSection = (key) => {
    setDraftSectionVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    markChanged();
  };

  // --- Handlers for Hero Stats ---
  const handleUpdateStatNum = (index, newNum) => {
    setDraftStats(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], number: newNum };
      return updated;
    });
    markChanged();
  };

  const handleUpdateStatLabel = (index, newLabel) => {
    setDraftStats(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], labelRu: newLabel, labelEn: newLabel };
      return updated;
    });
    markChanged();
  };

  return (
    <div className="site-editor-root" style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 🚀 Top Control Toolbar (Fixed) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9990,
          background: 'rgba(11, 19, 41, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-accent)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> Выйти в Админку
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Edit3 size={14} /> ВИЗУАЛЬНЫЙ РЕДАКТОР СТАЙТА
            </span>
            
            {hasChanges ? (
              <span style={{ fontSize: '0.8rem', color: '#eab308', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <AlertCircle size={14} /> Есть несохранённые правки в черновике
              </span>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Черновик совпадает с сайтом
              </span>
            )}
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{previewMode ? 'Выйти из Предпросмотра' : '👁️ Предпросмотр (как у гостей)'}</span>
          </button>

          {hasChanges && (
            <button
              type="button"
              onClick={handleResetDraft}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.4)' }}
            >
              <RefreshCw size={14} /> Сбросить черновик
            </button>
          )}

          <button
            type="button"
            onClick={handlePublishAll}
            className="btn btn-accent btn-lg"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(0,139,255,0.4)'
            }}
          >
            <Rocket size={18} />
            <span>🚀 Опубликовать на сайт</span>
          </button>
        </div>
      </header>

      {/* Editor Banner Notice */}
      {!previewMode && (
        <div style={{ background: 'rgba(0, 139, 255, 0.15)', borderBottom: '1px solid rgba(0, 139, 255, 0.3)', padding: '0.6rem 1.5rem', fontSize: '0.85rem', color: '#38bdf8', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}>
          <Sparkles size={16} />
          <span>Вы находитесь в режиме редактирования черновика. Нажимайте на текст для изменения, используйте кнопки ✏️ и 🗑️ на карточках. Готовые правки опубликуйте кнопкой сверху.</span>
        </div>
      )}

      {/* Main Page Render with Draft State */}
      <div className={previewMode ? 'preview-active' : 'editor-active'}>
        
        {/* 1. HERO SECTION */}
        {draftSectionVisibility.hero !== false && (
          <section style={{ position: 'relative' }}>
            {!previewMode && (
              <div style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 40 }}>
                <button
                  onClick={() => handleToggleSection('hero')}
                  className="btn btn-secondary btn-sm"
                  style={{ background: 'rgba(11, 19, 41, 0.9)' }}
                >
                  <EyeOff size={14} /> Скрыть секцию Hero
                </button>
              </div>
            )}
            
            <Hero
              stats={draftStats}
              customTitle={
                !previewMode ? (
                  <InlineText
                    value={draftHeroTitle}
                    onChange={(val) => { setDraftHeroTitle(val); markChanged(); }}
                    tag="span"
                  />
                ) : draftHeroTitle
              }
              customSubtitle={
                !previewMode ? (
                  <InlineText
                    value={draftHeroSubtitle}
                    onChange={(val) => { setDraftHeroSubtitle(val); markChanged(); }}
                    tag="span"
                    multiline
                  />
                ) : draftHeroSubtitle
              }
              renderStatItem={(statItem, idx) => {
                if (previewMode) return null;
                return (
                  <EditOverlay
                    key={statItem.id || idx}
                    title={`Счётчик #${idx + 1}`}
                    onEdit={() => {
                      const newNum = prompt('Введите значение счётчика:', statItem.number);
                      if (newNum !== null) handleUpdateStatNum(idx, newNum);
                      const newLabel = prompt('Введите подпись счётчика:', statItem.labelRu);
                      if (newLabel !== null) handleUpdateStatLabel(idx, newLabel);
                    }}
                    isEditingEnabled={!previewMode}
                  >
                    <div style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent)' }}>{statItem.number}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{statItem.labelRu}</div>
                    </div>
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

        {/* 2. VACANCIES SECTION */}
        {draftSectionVisibility.vacancies !== false && (
          <section style={{ position: 'relative', marginTop: '2rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-gold">СЕКЦИЯ ВАКАНСИЙ</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Всего: {draftVacancies.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={handleOpenAddVacancy} className="btn btn-primary btn-sm">
                    <Plus size={16} /> + Добавить Вакансию
                  </button>
                  <button onClick={() => handleToggleSection('vacancies')} className="btn btn-secondary btn-sm">
                    <EyeOff size={14} /> Скрыть вакансии
                  </button>
                </div>
              </div>
            )}

            <VacancyList
              vacancies={draftVacancies}
              renderVacancyCard={(vac, defaultCardNode) => {
                if (previewMode) return defaultCardNode;
                return (
                  <EditOverlay
                    key={vac.id}
                    isActive={vac.active !== false}
                    onEdit={() => handleOpenEditVacancy(vac)}
                    onDelete={() => handleDeleteVacancy(vac.id)}
                    onToggleActive={() => handleToggleVacancyActive(vac.id)}
                    isEditingEnabled={!previewMode}
                  >
                    {defaultCardNode}
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

        {/* 3. SEAFARER HUB SECTION */}
        {draftSectionVisibility.hub !== false && (
          <section style={{ position: 'relative', marginTop: '3rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-gold">SEAFARER HUB (БЛАНКИ И МАТЕРИАЛЫ)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Всего блоков: {draftHubBlocks.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={handleOpenAddHub} className="btn btn-primary btn-sm">
                    <Plus size={16} /> + Добавить Блок
                  </button>
                  <button onClick={() => handleToggleSection('hub')} className="btn btn-secondary btn-sm">
                    <EyeOff size={14} /> Скрыть Hub
                  </button>
                </div>
              </div>
            )}

            <SeafarerHub
              hubBlocks={draftHubBlocks}
              renderBlockItem={(block, defaultBlockNode) => {
                if (previewMode) return defaultBlockNode;
                return (
                  <EditOverlay
                    key={block.id}
                    isActive={block.active !== false}
                    onEdit={() => handleOpenEditHub(block)}
                    onDelete={() => handleDeleteHubBlock(block.id)}
                    onToggleActive={() => handleToggleHubActive(block.id)}
                    isEditingEnabled={!previewMode}
                  >
                    {defaultBlockNode}
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

        {/* 4. SHIPOWNER SERVICES SECTION */}
        {draftSectionVisibility.shipowners !== false && (
          <section style={{ position: 'relative', marginTop: '3rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <span className="badge badge-gold">СУДОВЛАДЕЛЬЦАМ (ФОРМА ЗАЯВОК)</span>
                <button onClick={() => handleToggleSection('shipowners')} className="btn btn-secondary btn-sm">
                  <EyeOff size={14} /> Скрыть форму для судовладельцев
                </button>
              </div>
            )}
            <ShipownerServices />
          </section>
        )}

        {/* 5. OFFICES & CONTACTS SECTION */}
        {draftSectionVisibility.offices !== false && (
          <section style={{ position: 'relative', marginTop: '3rem' }}>
            {!previewMode && (
              <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-gold">ФИЛИАЛЫ И КОНТАКТЫ</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Всего офисов: {draftOffices.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={handleOpenAddOffice} className="btn btn-primary btn-sm">
                    <Plus size={16} /> + Добавить Филиал
                  </button>
                  <button onClick={() => handleToggleSection('offices')} className="btn btn-secondary btn-sm">
                    <EyeOff size={14} /> Скрыть филиалы
                  </button>
                </div>
              </div>
            )}

            <OfficesAndContacts
              offices={draftOffices}
              renderOfficeCard={(off, defaultOfficeNode) => {
                if (previewMode) return defaultOfficeNode;
                return (
                  <EditOverlay
                    key={off.id}
                    isActive={off.active !== false}
                    onEdit={() => handleOpenEditOffice(off)}
                    onDelete={() => handleDeleteOffice(off.id)}
                    onToggleActive={() => handleToggleOfficeActive(off.id)}
                    isEditingEnabled={!previewMode}
                  >
                    {defaultOfficeNode}
                  </EditOverlay>
                );
              }}
            />
          </section>
        )}

      </div>

      {/* Editor Modals */}
      <VacancyFormModal
        isOpen={vacancyModalOpen}
        onClose={() => setVacancyModalOpen(false)}
        onSave={handleSaveVacancyModal}
        editingVacancy={editingVacancy}
      />

      <OfficeFormModal
        isOpen={officeModalOpen}
        onClose={() => setOfficeModalOpen(false)}
        onSave={handleSaveOfficeModal}
        editingOffice={editingOffice}
      />

      <HubBlockFormModal
        isOpen={hubModalOpen}
        onClose={() => setHubModalOpen(false)}
        onSave={handleSaveHubModal}
        editingBlock={editingHubBlock}
      />

    </div>
  );
};
