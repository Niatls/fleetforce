import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Building } from 'lucide-react';

import { INITIAL_OFFICES } from '../data/initialData';

export const OfficesAndContacts = ({ offices = INITIAL_OFFICES, renderOfficeCard, customTitle, customSubtitle, customHours, renderEditableHours }) => {
  const { lang, t } = useLanguage();
  const rawList = offices && offices.length > 0 ? offices : INITIAL_OFFICES;
  const officesList = renderOfficeCard ? rawList : rawList.filter(o => o && o.active !== false && !o.hidden);

  const displayTitle = (lang === 'ru' && customTitle) ? customTitle : t('offices.title');
  const displaySubtitle = (lang === 'ru' && customSubtitle) ? customSubtitle : t('offices.subtitle');
  const displayHours = (lang === 'ru' && customHours) ? customHours : t('offices.hours');

  const getFlag = (off) => {
    if (lang !== 'en') return off.flag;
    if (off.flagEn) return off.flagEn;
    if (String(off.flag).includes('Главный')) return '⚓ Headquarters';
    if (String(off.flag).includes('Черноморский')) return '🌊 Black Sea Branch';
    if (String(off.flag).includes('Балтийский')) return '🇪🇺 Baltic Office';
    if (String(off.flag).includes('Дальневосточный')) return '🌏 Far East Office';
    return off.flag;
  };

  const getCity = (off) => {
    if (lang !== 'en') return off.city;
    if (off.cityEn) return off.cityEn;
    if (String(off.city).includes('Санкт-Петербург')) return 'Saint Petersburg';
    if (String(off.city).includes('Новороссийск')) return 'Novorossiysk';
    if (String(off.city).includes('Калининград')) return 'Kaliningrad';
    if (String(off.city).includes('Владивосток')) return 'Vladivostok';
    return off.city;
  };

  const getAddress = (off) => {
    if (lang !== 'en') return off.address;
    if (off.addressEn) return off.addressEn;
    if (String(off.address).includes('Стачек')) return '47 Litera A Stachek Ave, Room 2NS, Office 340-342, Saint Petersburg';
    if (String(off.address).includes('Энгельса')) return '7 Engelsa/Svobody/Konstitutsii St, Office 37, Novorossiysk';
    if (String(off.address).includes('Ленинский')) return '81 Leninskiy Ave, Office 205, Kaliningrad';
    if (String(off.address).includes('Светланская')) return '45 Svetlanskaya St, Vladivostok';
    return off.address;
  };

  return (
    <section id="offices" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.6rem' }}>OFFICE NETWORK</span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '0.6rem' }}>{displayTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            {displaySubtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
          {officesList.map((off, idx) => {
            const officeNode = (
              <div key={off.id || idx} className="glass-card" style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.6rem' }}>
                    <span className="badge badge-blue" style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem', display: 'inline-block', maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: 1.3 }}>
                      {getFlag(off)}
                    </span>
                    <Clock size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  </div>

                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#FFFFFF' }}>
                    {getCity(off)}
                  </h3>

                  <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <MapPin size={16} color="var(--color-accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span>{getAddress(off)}</span>
                    </div>

                    {/* Individual Office Working Hours */}
                    {off.hours && (
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <Clock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{off.hours}</span>
                      </div>
                    )}

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
          {renderEditableHours ? renderEditableHours : displayHours}
        </div>

      </div>
    </section>
  );
};
