import React from 'react';
import { Plus, Eye, EyeOff, Trash2 } from 'lucide-react';

export const HeroStatsTab = ({
  stats = [],
  onUpdateStats
}) => {
  const handleAddStat = () => {
    const newStat = {
      id: String(Date.now()),
      number: '100+',
      labelRu: 'Новый показатель',
      labelEn: 'New Metric',
      color: 'blue',
      active: true
    };
    if (onUpdateStats) onUpdateStats([...stats, newStat]);
  };

  const handleToggleActive = (id) => {
    const updated = stats.map(s => s.id === id ? { ...s, active: s.active === false ? true : false } : s);
    if (onUpdateStats) onUpdateStats(updated);
  };

  const handleDeleteStat = (id) => {
    if (!window.confirm('Удалить этот показатель?')) return;
    const updated = stats.filter(s => s.id !== id);
    if (onUpdateStats) onUpdateStats(updated);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>Управление Главными Счетчиками (Hero Stats)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Добавляйте, скрывайте или меняйте цифры и подписи ключевых показателей агентства на главной странице.
          </p>
        </div>
        <button 
          type="button"
          onClick={handleAddStat} 
          className="btn btn-primary btn-md"
          style={{ gap: '0.5rem', fontWeight: 600 }}
        >
          <Plus size={18} /> + Добавить показатель
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
        {stats.map((st, idx) => {
          const isHidden = st.active === false;
          return (
            <div 
              key={st.id || idx} 
              className="glass-card" 
              style={{ 
                padding: '1.4rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justify: 'space-between', 
                gap: '1rem', 
                border: isHidden ? '1px dashed rgba(239,68,68,0.4)' : '1px solid var(--border-color)', 
                borderRadius: '12px', 
                background: isHidden ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-surface-elevated)', 
                opacity: isHidden ? 0.75 : 1,
                height: '100%' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Показатель #{idx + 1}</span>
                  <span className={isHidden ? "badge badge-danger" : "badge badge-blue"}>
                    {isHidden ? '🙈 Скрыт' : (st.color || 'blue').toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(st.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.25rem 0.5rem' }}
                    title={isHidden ? 'Показать показатель на сайте' : 'Скрыть показатель'}
                  >
                    {isHidden ? <Eye size={14} color="var(--color-emerald)" /> : <EyeOff size={14} color="var(--color-danger)" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStat(st.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.25rem 0.5rem', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                    title="Удалить показатель"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Значение (Число / Текст)</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={st.number || ''}
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
                  value={st.labelRu || ''}
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
                  value={st.color || 'blue'}
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
          );
        })}
      </div>
    </div>
  );
};
