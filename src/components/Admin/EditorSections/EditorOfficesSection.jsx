import React from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { OfficesAndContacts } from '../../OfficesAndContacts';
import { InlineText } from '../InlineText';
import { EditOverlay } from '../EditOverlay';

export const EditorOfficesSection = ({
  previewMode,
  draftSectionVisibility,
  handleToggleSection,
  draftOffices,
  handleOpenAddOffice,
  draftOfficesTitle,
  setDraftOfficesTitle,
  draftOfficesSubtitle,
  setDraftOfficesSubtitle,
  draftOfficesHours,
  setDraftOfficesHours,
  handleOpenEditOffice,
  handleDeleteOffice,
  handleToggleOfficeActive,
  markChanged
}) => {
  if (draftSectionVisibility.offices === false) {
    if (previewMode) return null;
    return (
      <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
          <EyeOff size={20} color="var(--color-danger)" />
          <span><strong>Секция «ФИЛИАЛЫ И КОНТАКТЫ» сейчас скрыта</strong> и не отображается на сайте.</span>
        </div>
        <button onClick={() => handleToggleSection('offices')} className="btn btn-primary btn-sm">
          <Eye size={14} /> Включить и показать филиалы
        </button>
      </div>
    );
  }

  return (
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
        customTitle={
          !previewMode ? (
            <InlineText
              value={draftOfficesTitle}
              onChange={(val) => { setDraftOfficesTitle(val); markChanged(); }}
              tag="span"
            />
          ) : draftOfficesTitle
        }
        customSubtitle={
          !previewMode ? (
            <InlineText
              value={draftOfficesSubtitle}
              onChange={(val) => { setDraftOfficesSubtitle(val); markChanged(); }}
              tag="span"
              multiline
            />
          ) : draftOfficesSubtitle
        }
        renderEditableHours={
          !previewMode ? (
            <InlineText
              value={draftOfficesHours}
              onChange={(val) => { setDraftOfficesHours(val); markChanged(); }}
              tag="span"
            />
          ) : draftOfficesHours
        }
        renderOfficeCard={(off, defaultOfficeNode) => {
          if (!off) return null;
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
  );
};
