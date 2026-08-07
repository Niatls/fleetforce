import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ShipownerServices } from '../../ShipownerServices';
import { InlineText } from '../InlineText';

export const EditorShipownerSection = ({
  previewMode,
  draftSectionVisibility,
  handleToggleSection,
  draftShipownerTitle,
  setDraftShipownerTitle,
  draftShipownerSubtitle,
  setDraftShipownerSubtitle,
  draftService1Title,
  setDraftService1Title,
  draftService1Desc,
  setDraftService1Desc,
  draftService2Title,
  setDraftService2Title,
  draftService2Desc,
  setDraftService2Desc,
  draftService3Title,
  setDraftService3Title,
  draftService3Desc,
  setDraftService3Desc,
  markChanged
}) => {
  if (draftSectionVisibility.shipowners === false) {
    if (previewMode) return null;
    return (
      <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
          <EyeOff size={20} color="var(--color-danger)" />
          <span><strong>Секция «СУДОВЛАДЕЛЬЦАМ» сейчас скрыта</strong> и не отображается на сайте.</span>
        </div>
        <button onClick={() => handleToggleSection('shipowners')} className="btn btn-primary btn-sm">
          <Eye size={14} /> Включить и показать секцию Судовладельцам
        </button>
      </div>
    );
  }

  return (
    <section style={{ position: 'relative', marginTop: '3rem' }}>
      {!previewMode && (
        <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-accent)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-gold">СУДОВЛАДЕЛЬЦАМ (УСЛУГИ И ЗАЯВКИ)</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>✏️ Кликните по заголовкам и карточкам для редактирования</span>
          </div>
          <button onClick={() => handleToggleSection('shipowners')} className="btn btn-secondary btn-sm">
            <EyeOff size={14} /> Скрыть форму для судовладельцев
          </button>
        </div>
      )}
      <ShipownerServices 
        customTitle={
          previewMode ? draftShipownerTitle : (
            <InlineText 
              text={draftShipownerTitle}
              onSave={(val) => { setDraftShipownerTitle(val); markChanged(); }}
              placeholder="Заголовок услуг для судовладельцев..."
            />
          )
        }
        customSubtitle={
          previewMode ? draftShipownerSubtitle : (
            <InlineText 
              text={draftShipownerSubtitle}
              onSave={(val) => { setDraftShipownerSubtitle(val); markChanged(); }}
              multiline
              placeholder="Подзаголовок услуг..."
            />
          )
        }
        customCard1Title={
          previewMode ? draftService1Title : (
            <InlineText 
              text={draftService1Title}
              onSave={(val) => { setDraftService1Title(val); markChanged(); }}
              placeholder="Название услуги 1..."
            />
          )
        }
        customCard1Desc={
          previewMode ? draftService1Desc : (
            <InlineText 
              text={draftService1Desc}
              onSave={(val) => { setDraftService1Desc(val); markChanged(); }}
              multiline
              placeholder="Описание услуги 1..."
            />
          )
        }
        customCard2Title={
          previewMode ? draftService2Title : (
            <InlineText 
              text={draftService2Title}
              onSave={(val) => { setDraftService2Title(val); markChanged(); }}
              placeholder="Название услуги 2..."
            />
          )
        }
        customCard2Desc={
          previewMode ? draftService2Desc : (
            <InlineText 
              text={draftService2Desc}
              onSave={(val) => { setDraftService2Desc(val); markChanged(); }}
              multiline
              placeholder="Описание услуги 2..."
            />
          )
        }
        customCard3Title={
          previewMode ? draftService3Title : (
            <InlineText 
              text={draftService3Title}
              onSave={(val) => { setDraftService3Title(val); markChanged(); }}
              placeholder="Название услуги 3..."
            />
          )
        }
        customCard3Desc={
          previewMode ? draftService3Desc : (
            <InlineText 
              text={draftService3Desc}
              onSave={(val) => { setDraftService3Desc(val); markChanged(); }}
              multiline
              placeholder="Описание услуги 3..."
            />
          )
        }
      />
    </section>
  );
};
