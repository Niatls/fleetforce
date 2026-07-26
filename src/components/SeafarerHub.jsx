import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, FileCheck, Award, TrendingUp, HelpCircle, FileText } from 'lucide-react';

export const SeafarerHub = ({ onOpenWizard }) => {
  const { t } = useLanguage();

  const handleDownloadForm = (filename) => {
    // Generate dummy printable/download text file for offline application
    const content = `FLEETFORCE CREWING AGENCY - SEAFARER APPLICATION FORM TEMPLATE\n=======================================================\n\nFull Name: ___________________________________________\nApplied Rank: ________________________________________\nDate of Birth: ________________________________________\nPassport No: _________________________________________\nSeaman's Book No: ____________________________________\nPhone / Email: _______________________________________\n\nSEA EXPERIENCE MATRIX:\n1. Vessel: ____________ Type: ________ DWT: ________ Rank: ________\n2. Vessel: ____________ Type: ________ DWT: ________ Rank: ________\n\nSignature: __________________________ Date: ___________`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Download BGI Application */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 139, 255, 0.15)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <FileText size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>BGI Standard Application</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Классический бланк морской анкеты группы компаний BGI в формате DOCX для офлайн заполнения.
              </p>
            </div>
            <button onClick={() => handleDownloadForm('BGI_Application_Form_2026.docx')} className="btn btn-secondary" style={{ width: '100%' }}>
              <Download size={16} /> {t('seafarersHub.downloadBgiForm')}
            </button>
          </div>

          {/* Download Legacy Marine Form */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Download size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>Legacy Marine CV Form</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Анкета Legacy Marine с расширенной матрицей опыта работы на танкерном флоте.
              </p>
            </div>
            <button onClick={() => handleDownloadForm('Legacy_Marine_Seaman_CV.pdf')} className="btn btn-secondary" style={{ width: '100%' }}>
              <Download size={16} /> {t('seafarersHub.downloadLegacyForm')}
            </button>
          </div>

          {/* STCW Checklist */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <FileCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{t('seafarersHub.stcwChecklist')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Полный перечень рабочих дипломов, подтверждений, НБЖС и медицинских комиссий (Подплав / ОУК) для рейса.
              </p>
            </div>
            <button onClick={onOpenWizard} className="btn btn-primary" style={{ width: '100%' }}>
              Заполнить онлайн
            </button>
          </div>

          {/* Marlins Testing Info */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Award size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{t('seafarersHub.marlinsInfo')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Официальное тестирование Marlins English Test и CES 6.0 в сертифицированных центрах СПб и Новороссийска.
              </p>
            </div>
            <a href="tel:+78005553535" className="btn btn-secondary" style={{ width: '100%' }}>
              Записаться на тест
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
