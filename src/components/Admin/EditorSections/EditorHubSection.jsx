import React from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { SeafarerHub } from '../../SeafarerHub';
import { InlineText } from '../InlineText';
import { EditOverlay } from '../EditOverlay';

export const EditorHubSection = ({
  previewMode,
  draftSectionVisibility,
  handleToggleSection,
  draftHubBlocks,
  handleOpenAddHub,
  draftHubTitle,
  setDraftHubTitle,
  draftHubSubtitle,
  setDraftHubSubtitle,
  handleOpenEditHub,
  handleDeleteHubBlock,
  handleToggleHubActive,
  markChanged
}) => {
  if (draftSectionVisibility.hub === false) {
    if (previewMode) return null;
    return (
      <div style={{ margin: '2rem', padding: '1.2rem 2rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FFFFFF' }}>
          <EyeOff size={20} color="var(--color-danger)" />
          <span><strong>Секция «МОРЯКАМ / HUB» сейчас скрыта</strong> и не отображается на сайте.</span>
        </div>
        <button onClick={() => handleToggleSection('hub')} className="btn btn-primary btn-sm">
          <Eye size={14} /> Включить и показать Hub
        </button>
      </div>
    );
  }

  return (
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
        customTitle={
          !previewMode ? (
            <InlineText
              value={draftHubTitle}
              onChange={(val) => { setDraftHubTitle(val); markChanged(); }}
              tag="span"
            />
          ) : draftHubTitle
        }
        customSubtitle={
          !previewMode ? (
            <InlineText
              value={draftHubSubtitle}
              onChange={(val) => { setDraftHubSubtitle(val); markChanged(); }}
              tag="span"
              multiline
            />
          ) : draftHubSubtitle
        }
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
  );
};
