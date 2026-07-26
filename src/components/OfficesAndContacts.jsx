import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Building } from 'lucide-react';

import { INITIAL_OFFICES } from '../data/initialData';

export const OfficesAndContacts = ({ offices = INITIAL_OFFICES }) => {
  const { t } = useLanguage();
  const officesList = offices && offices.length > 0 ? offices : INITIAL_OFFICES;

  return (
    <section id="offices" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.6rem' }}>OFFICE NETWORK</span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{t('offices.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {t('offices.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
          {officesList.map((off, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-blue">{off.flag}</span>
                <Clock size={16} color="var(--text-muted)" />
              </div>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#FFFFFF' }}>
                {off.city}
              </h3>

              <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <MapPin size={16} color="var(--color-accent)" style={{ marginTop: '3px', shrink: 0 }} />
                  <span>{off.address}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <Phone size={16} color="var(--color-emerald)" />
                  <a href={`tel:${off.phone}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{off.phone}</a>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <Mail size={16} color="var(--color-gold)" />
                  <a href={`mailto:${off.email}`}>{off.email}</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Clock size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          {t('offices.hours')}
        </div>

      </div>
    </section>
  );
};
