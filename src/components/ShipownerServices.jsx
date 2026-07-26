import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Anchor, FileText, CheckCircle, Mail, Send } from 'lucide-react';

export const ShipownerServices = () => {
  const { t } = useLanguage();

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    alert('Спасибо за запрос! Отдел работы с судовладельцами свяжется с вашей компанией в течение 1 часа.');
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <Anchor size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{t('shipowners.service1Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {t('shipowners.service1Desc')}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-emerald-light)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <Shield size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{t('shipowners.service2Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {t('shipowners.service2Desc')}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-gold-light)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{t('shipowners.service3Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {t('shipowners.service3Desc')}
            </p>
          </div>

        </div>

        {/* Shipowner Request Form */}
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-surface-elevated)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', textAlign: 'center', color: '#FFFFFF' }}>
            Запросить расчет стоимости комплектования экипажа
          </h3>
          <form onSubmit={handleRequestSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" required placeholder="Название компании / Судовладельца" className="form-input" />
            <input type="text" required placeholder="Имя контактного лица" className="form-input" />
            <input type="email" required placeholder="Корпоративный Email" className="form-input" />
            <input type="tel" required placeholder="Телефон для связи" className="form-input" />
            <textarea placeholder="Укажите тип судна, флот, необходимое количество экипажа..." className="form-textarea" style={{ gridColumn: '1 / -1', height: '100px' }}></textarea>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', height: '48px' }}>
              <Send size={18} /> {t('shipowners.requestBtn')}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
