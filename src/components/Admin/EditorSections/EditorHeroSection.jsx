import React from 'react';
import { Eye, EyeOff, Plus, Edit3, Trash2 } from 'lucide-react';
import { Hero } from '../../Hero';
import { InlineText } from '../InlineText';

export const EditorHeroSection = ({
  previewMode,
  draftSectionVisibility,
  handleToggleSection,
  draftStats,
  handleAddStat,
  handleToggleStatActive,
  handleUpdateStatNum,
  handleUpdateStatLabel,
  handleDeleteStat,
  draftHeroBadge,
  setDraftHeroBadge,
  draftHeroTitle,
  setDraftHeroTitle,
  draftHeroSubtitle,
  setDraftHeroSubtitle,
  markChanged
}) => {
  if (draftSectionVisibility.hero === false) {
    if (previewMode) return null;
    return (
      <div style={{ margin: '1rem 2rem 2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
          <EyeOff size={20} color="var(--color-danger)" />
          <span><strong>Секция «Hero (Главный баннер)» сейчас скрыта</strong> и не отображается на сайте.</span>
        </div>
        <button onClick={() => handleToggleSection('hero')} className="btn btn-primary btn-sm">
          <Eye size={14} /> Включить и показать секцию Hero
        </button>
      </div>
    );
  }

  return (
    <section style={{ position: 'relative' }}>
      {!previewMode && (
        <div style={{ padding: '1rem 2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-gold">СЕКЦИЯ HERO / СЧЁТЧИКИ</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Всего счётчиков: {draftStats.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={handleAddStat} className="btn btn-primary btn-sm">
              <Plus size={16} /> + Добавить счётчик
            </button>
            <button onClick={() => handleToggleSection('hero')} className="btn btn-secondary btn-sm">
              <EyeOff size={14} /> Скрыть секцию Hero
            </button>
          </div>
        </div>
      )}
      
      <Hero
        stats={draftStats}
        customBadge={
          !previewMode ? (
            <InlineText
              value={draftHeroBadge}
              onChange={(val) => { setDraftHeroBadge(val); markChanged(); }}
              tag="span"
            />
          ) : draftHeroBadge
        }
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
          if (!statItem) return null;
          if (previewMode) {
            if (statItem.active === false) return <div key={statItem.id || idx} style={{ display: 'none' }} />;
            return null;
          }
          const isHidden = statItem.active === false;
          return (
            <div
              key={statItem.id || idx}
              style={{
                position: 'relative',
                padding: '0.8rem',
                borderRadius: '12px',
                border: isHidden ? '2px dashed rgba(239, 68, 68, 0.5)' : '1px dashed var(--color-accent)',
                background: isHidden ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 139, 255, 0.05)',
                opacity: isHidden ? 0.65 : 1,
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.4rem' }}>
                <span className={isHidden ? "badge badge-danger" : "badge badge-blue"} style={{ fontSize: '0.7rem' }}>
                  {isHidden ? '🙈 Скрыт' : `Счётчик #${idx + 1}`}
                </span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleStatActive(statItem.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                    title={isHidden ? 'Показать счётчик на сайте' : 'Скрыть счётчик'}
                  >
                    {isHidden ? <Eye size={13} color="var(--color-emerald)" /> : <EyeOff size={13} color="var(--color-danger)" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newNum = prompt('Введите значение счётчика:', statItem.number);
                      if (newNum !== null) handleUpdateStatNum(idx, newNum);
                      const newLabel = prompt('Введите подпись счётчика:', statItem.labelRu);
                      if (newLabel !== null) handleUpdateStatLabel(idx, newLabel);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                    title="Редактировать счётчик"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStat(statItem.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                    title="Удалить счётчик"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-accent)' }}>{statItem.number}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{statItem.labelRu}</div>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
};
