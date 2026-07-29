import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, FileCheck, Award, TrendingUp, HelpCircle, FileText } from 'lucide-react';

import { INITIAL_HUB_BLOCKS } from '../data/initialData';

export const SeafarerHub = ({ onOpenWizard, hubBlocks = INITIAL_HUB_BLOCKS }) => {
  const { t } = useLanguage();
  const blocksList = (hubBlocks && hubBlocks.length > 0 ? hubBlocks : INITIAL_HUB_BLOCKS).filter(b => b.active !== false && !b.hidden);

  const handleDownloadBlock = (block) => {
    if (block && block.fileData) {
      const a = document.createElement('a');
      a.href = block.fileData;
      a.download = block.filename || 'Seafarer_Document.docx';
      a.click();
      return;
    }

    const filename = block?.filename || 'Seafarer_CV_Form.docx';
    const content = `FLEETFORCE CREWING AGENCY - SEAFARER APPLICATION FORM TEMPLATE\n=======================================================\n\nFull Name: ___________________________________________\nApplied Rank: ________________________________________\nDate of Birth: ________________________________________\nPassport No: _________________________________________\nSeaman's Book No: ____________________________________\nPhone / Email: _______________________________________\n\nSEA EXPERIENCE MATRIX:\n1. Vessel: ____________ Type: ________ DWT: ________ Rank: ________\n2. Vessel: ____________ Type: ________ DWT: ________ Rank: ________\n\nSignature: __________________________ Date: ___________`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
      justifyContent: 'center',
      marginBottom: '1.2rem'
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
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{t('seafarersHub.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {t('seafarersHub.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
          {blocksList.map((block) => (
            <div key={block.id} className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
              <div>
                {getIcon(block.iconType, block.color)}
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{block.title}</h3>
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
          ))}
        </div>
      </div>
    </section>
  );
};
