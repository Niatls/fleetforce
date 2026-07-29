import React from 'react';

export const HeroStatsTab = ({
  stats,
  onUpdateStats
}) => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>Управление Главными Счетчиками (Hero Stats)</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Изменяйте цифры и подписи 4 ключевых показателей агентства на главной странице сайта.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
        {stats.map((st) => (
          <div key={st.id} className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-surface-elevated)', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Показатель #{st.id}</span>
              <span className="badge badge-blue">{st.color.toUpperCase()}</span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Значение (Число / Текст)</label>
              <input 
                type="text" 
                className="form-input"
                value={st.number}
                onChange={(e) => {
                  const updated = stats.map(s => s.id === st.id ? { ...s, number: e.target.value } : s);
                  if (onUpdateStats) onUpdateStats(updated);
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Подпись (Русский)</label>
              <input 
                type="text" 
                className="form-input"
                value={st.labelRu}
                onChange={(e) => {
                  const updated = stats.map(s => s.id === st.id ? { ...s, labelRu: e.target.value } : s);
                  if (onUpdateStats) onUpdateStats(updated);
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Подпись (English)</label>
              <input 
                type="text" 
                className="form-input"
                value={st.labelEn || ''}
                onChange={(e) => {
                  const updated = stats.map(s => s.id === st.id ? { ...s, labelEn: e.target.value } : s);
                  if (onUpdateStats) onUpdateStats(updated);
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Цветовой акцент</label>
              <select 
                className="form-select"
                value={st.color}
                onChange={(e) => {
                  const updated = stats.map(s => s.id === st.id ? { ...s, color: e.target.value } : s);
                  if (onUpdateStats) onUpdateStats(updated);
                }}
              >
                <option value="blue">Голубой (Blue)</option>
                <option value="emerald">Изумрудный (Emerald)</option>
                <option value="gold">Золотой (Gold)</option>
                <option value="white">Белый (White)</option>
                <option value="danger">Красный (Danger)</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
