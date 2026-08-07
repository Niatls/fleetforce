import React from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { VacancyList } from '../../VacancyList';
import { InlineText } from '../InlineText';
import { EditOverlay } from '../EditOverlay';

export const EditorVacanciesSection = ({
  previewMode,
  draftSectionVisibility,
  handleToggleSection,
  draftVacancies,
  handleOpenAddVacancy,
  draftVacanciesTitle,
  setDraftVacanciesTitle,
  draftVacanciesSubtitle,
  setDraftVacanciesSubtitle,
  handleOpenEditVacancy,
  handleDeleteVacancy,
  handleToggleVacancyActive,
  markChanged
}) => {
  if (draftSectionVisibility.vacancies === false) {
    if (previewMode) return null;
    return (
      <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
          <EyeOff size={20} color="var(--color-danger)" />
          <span><strong>Секция «ВАКАНСИИ» сейчас скрыта</strong> и не отображается на сайте.</span>
        </div>
        <button onClick={() => handleToggleSection('vacancies')} className="btn btn-primary btn-sm">
          <Eye size={14} /> Включить и показать вакансии
        </button>
      </div>
    );
  }

  return (
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
        customTitle={
          !previewMode ? (
            <InlineText
              value={draftVacanciesTitle}
              onChange={(val) => { setDraftVacanciesTitle(val); markChanged(); }}
              tag="span"
            />
          ) : draftVacanciesTitle
        }
        customSubtitle={
          !previewMode ? (
            <InlineText
              value={draftVacanciesSubtitle}
              onChange={(val) => { setDraftVacanciesSubtitle(val); markChanged(); }}
              tag="span"
              multiline
            />
          ) : draftVacanciesSubtitle
        }
        renderVacancyCard={(vac, defaultCardNode) => {
          if (!vac) return null;
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
  );
};
