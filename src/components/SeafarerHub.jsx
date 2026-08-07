import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, FileCheck, Award, TrendingUp, HelpCircle, FileText } from 'lucide-react';

import { INITIAL_HUB_BLOCKS } from '../data/initialData';

export const SeafarerHub = ({ onOpenWizard, hubBlocks = INITIAL_HUB_BLOCKS, renderBlockItem, customTitle, customSubtitle }) => {
  const { lang, t } = useLanguage();
  const rawList = hubBlocks && hubBlocks.length > 0 ? hubBlocks : INITIAL_HUB_BLOCKS;
  const blocksList = renderBlockItem ? rawList : rawList.filter(b => b && b.active !== false && !b.hidden);

  const displayTitle = (lang === 'ru' && customTitle) ? customTitle : t('seafarersHub.title');
  const displaySubtitle = (lang === 'ru' && customSubtitle) ? customSubtitle : t('seafarersHub.subtitle');

  const handleDownloadBlock = (block) => {
    if (block && block.fileData) {
      const a = document.createElement('a');
      a.href = block.fileData;
      a.download = block.filename || 'Application form.docx';
      a.click();
      return;
    }

    // Block 1 = PDF application form
    if (block?.id === 1 || block?.filename?.match(/\.pdf$/i) || String(block?.title).toLowerCase().includes('pdf')) {
      const a = document.createElement('a');
      a.href = './Crew_Application_Form.pdf';
      a.download = 'Crew_Application_Form.pdf';
      a.click();
      return;
    }

    // Block 2 = DOC application form
    if (block?.id === 2 || block?.filename?.match(/\.(doc|docx)$/i) || String(block?.title).toLowerCase().includes('doc')) {
      const a = document.createElement('a');
      a.href = './Application form.docx';
      a.download = 'Application form.docx';
      a.click();
      return;
    }

    // Default: PDF
    const a = document.createElement('a');
    a.href = './Crew_Application_Form.pdf';
    a.download = 'Crew_Application_Form.pdf';
    a.click();
  };

  const getIcon = (type, colorStr) => {
    const style = {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: colorStr === 'gold' ? 'rgba(245, 158, 11, 0.15)' : colorStr === 'emerald' ? 'rgba(16, 185, 129, 0.15)' : colorStr === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 132, 199, 0.15)',
      color: colorStr === 'gold' ? 'var(--color-gold)' : colorStr === 'emerald' ? 'var(--color-emerald)' : colorStr === 'danger' ? 'var(--color-danger)' : 'var(--color-accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    if (type === 'Download') return <div style={style}><Download size={26} /></div>;
    if (type === 'FileCheck') return <div style={style}><FileCheck size={26} /></div>;
    if (type === 'Award') return <div style={style}><Award size={26} /></div>;
    return <div style={style}><FileText size={26} /></div>;
  };

  const getBlockTitle = (block) => {
    if (lang !== 'en') return block.title;
    if (block.titleEn) return block.titleEn;
    if (block.id === 1 || String(block.title).includes('PDF')) return 'Fleet Force Standard Application (PDF)';
    if (block.id === 2 || String(block.title).includes('DOC')) return 'Fleet Force CV Form (DOC)';
    if (block.id === 3 || String(block.title).includes('Чек-лист') || String(block.title).includes('анкету')) return 'Online application';
    return block.title;
  };

  const getBlockDesc = (block) => {
    if (lang !== 'en') return block.description;
    if (block.descriptionEn) return block.descriptionEn;
    if (block.id === 1 || String(block.title).includes('PDF')) return 'Official 5-page maritime application form of FleetForce Crewing Alliance in PDF format for offline completion.';
    if (block.id === 2 || String(block.title).includes('DOC')) return 'Editable Word (.DOC) seafarer application form with full sea service experience matrix.';
    if (block.id === 3 || String(block.title).includes('Чек-лист')) return 'Complete checklist of CoC, STCW certificates, medical exams, and online application wizard.';
    return block.description;
  };

  const getBlockBtn = (block) => {
    if (lang !== 'en') return block.buttonText;
    if (block.buttonTextEn) return block.buttonTextEn;
    if (block.actionType === 'wizard') return 'Apply Online';
    if (block.id === 1 || block?.filename?.match(/\.pdf$/i) || String(block?.title).toLowerCase().includes('pdf')) return 'Download Fleet Force Form (.PDF)';
    if (block.id === 2 || block?.filename?.match(/\.(doc|docx)$/i) || String(block?.title).toLowerCase().includes('doc')) return 'Download Fleet Force Form (.DOC)';
    return block.buttonText || 'Download Form';
  };

  return (
    <section id="seafarers" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.6rem' }}>FOR SEAFARERS / МОРЯКАМ</span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{displayTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {displaySubtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
          {blocksList.map((block) => {
            const blockNode = (
              <div key={block.id} className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
                <div>
                  {/* Row 1: Badges Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className={`badge badge-${block.color || 'blue'}`} style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}>
                      {block.actionType ? block.actionType.toUpperCase() : 'INFO'}
                    </span>
                    {getIcon(block.iconType, block.color)}
                  </div>

                  {/* Row 2: Title */}
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem', color: '#FFFFFF' }}>{getBlockTitle(block)}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {getBlockDesc(block)}
                  </p>
                </div>

                {block.actionType === 'wizard' ? (
                  <button onClick={onOpenWizard} className="btn btn-primary" style={{ width: '100%' }}>
                    {getBlockBtn(block)}
                  </button>
                ) : block.actionType === 'link' ? (
                  <a href={block.linkUrl || 'tel:+78005553535'} className="btn btn-secondary" style={{ width: '100%' }}>
                    {getBlockBtn(block)}
                  </a>
                ) : (
                  <button onClick={() => handleDownloadBlock(block)} className="btn btn-secondary" style={{ width: '100%' }}>
                    <Download size={16} /> {getBlockBtn(block)}
                  </button>
                )}
              </div>
            );

            if (renderBlockItem) {
              return renderBlockItem(block, blockNode);
            }
            return blockNode;
          })}
        </div>
      </div>
    </section>
  );
};
