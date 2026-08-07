import React from 'react';
import { Footer } from '../../Footer';
import { InlineText } from '../InlineText';

export const EditorFooterSection = ({
  previewMode,
  draftFooterBrandDesc,
  setDraftFooterBrandDesc,
  draftFooterCertText,
  setDraftFooterCertText,
  draftFooterCopyright,
  setDraftFooterCopyright,
  markChanged
}) => {
  return (
    <section style={{ position: 'relative', marginTop: '2rem' }}>
      {!previewMode && (
        <div style={{ padding: '0.5rem 2rem', background: 'rgba(0,139,255,0.05)', borderTop: '1px dashed var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-gold">ПОДВАЛ САЙТА (FOOTER)</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>✏️ Кликните по текстам описания, сертификатов и копирайта для редактирования</span>
        </div>
      )}
      <Footer 
        onOpenAdmin={() => {}}
        customBrandDesc={
          previewMode ? draftFooterBrandDesc : (
            <InlineText 
              text={draftFooterBrandDesc}
              onSave={(val) => { setDraftFooterBrandDesc(val); markChanged(); }}
              multiline
              placeholder="Описание компании в подвале..."
            />
          )
        }
        customCertText={
          previewMode ? draftFooterCertText : (
            <InlineText 
              text={draftFooterCertText}
              onSave={(val) => { setDraftFooterCertText(val); markChanged(); }}
              multiline
              placeholder="Текст сертификации..."
            />
          )
        }
        customCopyright={
          previewMode ? draftFooterCopyright : (
            <InlineText 
              text={draftFooterCopyright}
              onSave={(val) => { setDraftFooterCopyright(val); markChanged(); }}
              multiline
              placeholder="Текст авторских прав..."
            />
          )
        }
      />
    </section>
  );
};
