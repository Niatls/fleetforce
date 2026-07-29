import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Anchor, FileText, CheckCircle, Mail, Send } from 'lucide-react';

export const ShipownerServices = ({ onRequestSubmit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = React.useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    details: ''
  });
  const [submitted, setSubmitted] = React.useState(false);

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
    <section id="shipowners" style={{ padding: '5rem 0', background: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '0.6rem' }}>CREW MANAGEMENT & MANNING</span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{t('shipowners.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {t('shipowners.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', marginBottom: '4rem', alignItems: 'stretch' }}>
          
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <Anchor size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{t('shipowners.service1Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {t('shipowners.service1Desc')}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
            <div>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-emerald-light)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Shield size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{t('shipowners.service2Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t('shipowners.service2Desc')}
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
            <div>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-gold-light)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <FileText size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{t('shipowners.service3Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t('shipowners.service3Desc')}
              </p>
            </div>
          </div>

        </div>

        {/* Shipowner Request Form */}
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-surface-elevated)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', textAlign: 'center', color: '#FFFFFF' }}>
            Запросить расчет стоимости комплектования экипажа
          </h3>

          {submitted ? (
            <div style={{ background: 'var(--color-emerald-light)', border: '1px solid rgba(16,185,129,0.3)', padding: '1.8rem', borderRadius: 'var(--radius-md)', textCenter: 'center', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle size={32} />
              </div>
              <h4 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Заявка на расчет успешно отправлена!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.2rem' }}>
                Наш отдел по работе с судовладельцами FleetForce обработает запрос и свяжется с вами в течение 1 часа.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm">
                Отправить еще один запрос
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input 
                type="text" 
                required 
                placeholder="Название компании / Судовладельца" 
                className="form-input"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
              <input 
                type="text" 
                required 
                placeholder="Имя контактного лица" 
                className="form-input"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
              <input 
                type="email" 
                required 
                placeholder="Корпоративный Email" 
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input 
                type="tel" 
                required 
                placeholder="Телефон для связи" 
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <textarea 
                placeholder="Укажите тип судна, флот, необходимое количество экипажа..." 
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
