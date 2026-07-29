import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X } from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES, getRankLabel, getVesselLabel } from '../../data/initialData';

export const VacancyFormModal = ({
  isOpen,
  editingVacancyId,
  vacancyForm,
  setVacancyForm,
  onClose,
  onSave
}) => {
  const { lang, t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
            {editingVacancyId ? 'Редактировать Вакансию' : t('admin.addVacancyBtn')}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSave} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Заголовок вакансии</label>
            <input 
              type="text" 
              required
              placeholder={t('admin.vacTitle')}
              className="form-input"
              value={vacancyForm.title}
              onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Должность</label>
              <select 
                className="form-select"
                value={vacancyForm.rank}
                onChange={(e) => setVacancyForm({ ...vacancyForm, rank: e.target.value })}
              >
                {MARITIME_RANKS.map((r) => (
                  <option key={r} value={r}>{getRankLabel(r, lang)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Тип судна</label>
              <select 
                className="form-select"
                value={vacancyForm.vesselType}
                onChange={(e) => setVacancyForm({ ...vacancyForm, vesselType: e.target.value })}
              >
                {VESSEL_TYPES.map((v) => (
                  <option key={v} value={v}>{getVesselLabel(v, lang)}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Оклад ($ / мес)</label>
              <input 
                type="text" 
                placeholder="Оклад (e.g. $12,500)"
                className="form-input"
                value={vacancyForm.salary}
                onChange={(e) => setVacancyForm({ ...vacancyForm, salary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Длительность контракта</label>
              <input 
                type="text" 
                placeholder="Контракт (e.g. 4 months)"
                className="form-input"
                value={vacancyForm.contract}
                onChange={(e) => setVacancyForm({ ...vacancyForm, contract: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">DWT / Двигатель</label>
              <input 
                type="text" 
                placeholder="47,000 DWT (MAN B&W)"
                className="form-input"
                value={vacancyForm.dwt}
                onChange={(e) => setVacancyForm({ ...vacancyForm, dwt: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Порт посадки</label>
              <input 
                type="text" 
                placeholder="Роттердам, Нидерланды"
                className="form-input"
                value={vacancyForm.joiningPort}
                onChange={(e) => setVacancyForm({ ...vacancyForm, joiningPort: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Дата готовности</label>
            <input 
              type="text" 
              placeholder="15.08.2026"
              className="form-input"
              value={vacancyForm.joiningDate}
              onChange={(e) => setVacancyForm({ ...vacancyForm, joiningDate: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={vacancyForm.urgent}
                onChange={(e) => setVacancyForm({ ...vacancyForm, urgent: e.target.checked })}
              />
              <span style={{ color: vacancyForm.urgent ? 'var(--color-danger)' : 'var(--text-primary)', fontWeight: 600 }}>Пометить как СРОЧНАЯ! (HOT)</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-accent">
              {editingVacancyId ? 'Сохранить изменения' : t('admin.saveVacBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
