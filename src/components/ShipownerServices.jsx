import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Anchor, FileText, CheckCircle, Mail, Send } from 'lucide-react';

export const ShipownerServices = ({ 
  onRequestSubmit,
  customTitle,
  customSubtitle,
  customCard1Title,
  customCard1Desc,
  customCard2Title,
  customCard2Desc,
  customCard3Title,
  customCard3Desc
}) => {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = React.useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    details: ''
  });
  const [submitted, setSubmitted] = React.useState(false);

  const displayTitle = (lang === 'ru' && customTitle !== undefined) ? customTitle : t('shipowners.title');
  const displaySubtitle = (lang === 'ru' && customSubtitle !== undefined) ? customSubtitle : t('shipowners.subtitle');
  const c1Title = (lang === 'ru' && customCard1Title !== undefined) ? customCard1Title : t('shipowners.service1Title');
  const c1Desc = (lang === 'ru' && customCard1Desc !== undefined) ? customCard1Desc : t('shipowners.service1Desc');
  const c2Title = (lang === 'ru' && customCard2Title !== undefined) ? customCard2Title : t('shipowners.service2Title');
  const c2Desc = (lang === 'ru' && customCard2Desc !== undefined) ? customCard2Desc : t('shipowners.service2Desc');
  const c3Title = (lang === 'ru' && customCard3Title !== undefined) ? customCard3Title : t('shipowners.service3Title');
  const c3Desc = (lang === 'ru' && customCard3Desc !== undefined) ? customCard3Desc : t('shipowners.service3Desc');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `REQ-${Date.now()}`,
      companyName: formData.companyName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      details: formData.details,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    if (onRequestSubmit) {
      onRequestSubmit(newRequest);
    }
    setSubmitted(true);
    setFormData({ companyName: '', contactName: '', email: '', phone: '', details: '' });
  };

  return (
    <section id="shipowners" style={{ padding: '5rem 0', background: 'var(--bg-deep)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '0.6rem' }}>FOR SHIPOWNERS & OPERATORS</span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{displayTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {displaySubtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', marginBottom: '4rem', alignItems: 'stretch' }}>
          
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
            <div>
              {/* Row 1: Badges Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <span className="badge badge-blue" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}>
                  FULL MANNING
                </span>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Anchor size={22} />
                </div>
              </div>
              {/* Row 2: Title */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                {c1Title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {c1Desc}
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
            <div>
              {/* Row 1: Badges Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <span className="badge badge-emerald" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}>
                  SINGLE OFFICERS
                </span>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-emerald-light)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={22} />
                </div>
              </div>
              {/* Row 2: Title */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                {c2Title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {c2Desc}
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
            <div>
              {/* Row 1: Badges Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <span className="badge badge-gold" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}>
                  COMPLIANCE & DOCUMENTS
                </span>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-gold-light)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={22} />
                </div>
              </div>
              {/* Row 2: Title */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#FFFFFF' }}>
                {c3Title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {c3Desc}
              </p>
            </div>
          </div>

        </div>

        {/* Shipowner Request Form */}
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-surface-elevated)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', textAlign: 'center', color: '#FFFFFF' }}>
            {t('shipowners.formTitle')}
          </h3>

          {submitted ? (
            <div style={{ background: 'var(--color-emerald-light)', border: '1px solid rgba(16,185,129,0.3)', padding: '1.8rem', borderRadius: 'var(--radius-md)', textCenter: 'center', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle size={32} />
              </div>
              <h4 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                {lang === 'en' ? 'Crew Inquiry Submitted Successfully!' : 'Заявка на расчет успешно отправлена!'}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.2rem' }}>
                {lang === 'en' 
                  ? 'Our FleetForce crew management department will process your request and contact you within 1 hour.' 
                  : 'Наш отдел по работе с судовладельцами FleetForce обработает запрос и свяжется с вами в течение 1 часа.'}
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm">
                {lang === 'en' ? 'Submit Another Request' : 'Отправить еще один запрос'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                required 
                placeholder={t('shipowners.companyPlaceholder')}
                className="form-input"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
              <input 
                type="text" 
                required 
                placeholder={t('shipowners.contactPlaceholder')}
                className="form-input"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
              <input 
                type="email" 
                required 
                placeholder={t('shipowners.emailPlaceholder')}
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input 
                type="tel" 
                required 
                placeholder={t('shipowners.phonePlaceholder')}
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <textarea 
                placeholder={t('shipowners.detailsPlaceholder')}
                className="form-textarea" 
                style={{ gridColumn: '1 / -1', height: '100px' }}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              ></textarea>
              <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', height: '48px' }}>
                <Send size={18} /> {t('shipowners.requestBtn')}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
