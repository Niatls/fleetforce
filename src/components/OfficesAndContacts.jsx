import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Building } from 'lucide-react';

import { INITIAL_OFFICES } from '../data/initialData';

export const OfficesAndContacts = ({ offices = INITIAL_OFFICES, renderOfficeCard, customTitle, customSubtitle }) => {
  const { t } = useLanguage();
  const rawList = offices && offices.length > 0 ? offices : INITIAL_OFFICES;
  const officesList = renderOfficeCard ? rawList : rawList.filter(o => o.active !== false && !o.hidden);

  return (
    <section id="offices" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.6rem' }}>OFFICE NETWORK</span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{customTitle || t('offices.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {customSubtitle || t('offices.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
          {officesList.map((off, idx) => {
            const officeNode = (
              <div key={off.id || idx} className="glass-card" style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.6rem' }}>
                    <span className="badge badge-blue" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', display: 'inline-block', maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: 1.3 }}>
                      {off.flag}
                    </span>
                    <Clock size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  </div>

                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#FFFFFF' }}>
                    {off.city}
                  </h3>

                  <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <MapPin size={16} color="var(--color-accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span>{off.address}</span>
                    </div>

                    {/* Phones list */}
                    {(() => {
                      const phones = Array.isArray(off.phones) && off.phones.length > 0
                        ? off.phones
                        : String(off.phone || '').split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
                      if (phones.length === 0) return null;
                      return (
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                          <Phone size={16} color="var(--color-emerald)" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {phones.map((p, pIdx) => (
                              <a key={pIdx} href={`tel:${p.replace(/[^\d+]/g, '')}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p}</a>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Emails list */}
                    {(() => {
                      const emails = Array.isArray(off.emails) && off.emails.length > 0
                        ? off.emails
                        : String(off.email || '').split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
                      if (emails.length === 0) return null;
                      return (
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                          <Mail size={16} color="var(--color-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {emails.map((m, mIdx) => (
                              <a key={mIdx} href={`mailto:${m}`} style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{m}</a>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );

            if (renderOfficeCard) {
              return renderOfficeCard(off, officeNode);
            }
            return officeNode;
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Clock size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          {t('offices.hours')}
        </div>

      </div>
    </section>
  );
};
