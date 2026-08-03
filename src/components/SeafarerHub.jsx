import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, FileCheck, Award, TrendingUp, HelpCircle, FileText } from 'lucide-react';

import { INITIAL_HUB_BLOCKS } from '../data/initialData';

export const SeafarerHub = ({ onOpenWizard, hubBlocks = INITIAL_HUB_BLOCKS, renderBlockItem, customTitle, customSubtitle }) => {
  const { t } = useLanguage();
  const rawList = hubBlocks && hubBlocks.length > 0 ? hubBlocks : INITIAL_HUB_BLOCKS;
  const blocksList = renderBlockItem ? rawList : rawList.filter(b => b.active !== false && !b.hidden);

  const handleDownloadBlock = (block) => {
    if (block && block.fileData) {
      const a = document.createElement('a');
      a.href = block.fileData;
      a.download = block.filename || 'Crew_Application_Form.pdf';
      a.click();
      return;
    }

    if (block?.filename?.match(/\.(doc|docx)$/i)) {
      // Download blank DOC version of Crew_Application_Form
      import('./Admin/exportUtils').then(({ handleExportDoc }) => {
        handleExportDoc({
          id: 'BLANK-FORM',
          fullName: '',
          appliedRank: '',
          readyDate: '',
          seaService: [],
          certificates: [],
          recordBooks: [],
          employers: []
        });
      });
      return;
    }

    // Default: Download official Crew_Application_Form.pdf
    const a = document.createElement('a');
    a.href = './Crew_Application_Form.pdf';
    a.download = block?.filename || 'Crew_Application_Form.pdf';
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

  return (
    <section id="seafarers" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.6rem' }}>FOR SEAFARERS / МОРЯКАМ</span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{customTitle || t('seafarersHub.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {customSubtitle || t('seafarersHub.subtitle')}
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
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem', color: '#FFFFFF' }}>{block.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {block.description}
                  </p>
                </div>

                {block.actionType === 'wizard' ? (
                  <button onClick={onOpenWizard} className="btn btn-primary" style={{ width: '100%' }}>
                    {block.buttonText || 'Заполнить онлайн'}
                  </button>
                ) : block.actionType === 'link' ? (
                  <a href={block.linkUrl || 'tel:+78005553535'} className="btn btn-secondary" style={{ width: '100%' }}>
                    {block.buttonText || 'Подробнее'}
                  </a>
                ) : (
                  <button onClick={() => handleDownloadBlock(block)} className="btn btn-secondary" style={{ width: '100%' }}>
                    <Download size={16} /> {block.buttonText || t('seafarersHub.downloadBgiForm')}
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
