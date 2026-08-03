import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X } from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES, getRankLabel, getVesselLabel } from '../../data/initialData';

export const VacancyFormModal = ({
  isOpen,
  editingVacancy,
  editingVacancyId,
  vacancyForm: externalForm,
  setVacancyForm: setExternalForm,
  onClose,
  onSave
}) => {
  const { lang, t } = useLanguage();

  const defaultForm = {
    title: '',
    rank: '',
    vesselType: '',
    dwt: '47,000 DWT',
    salary: '$8,500',
    contract: '4 months',
    joiningPort: 'Rotterdam, Netherlands',
    joiningDate: '15.08.2026',
    urgent: false,
    active: true,
    requirements: ['Valid STCW Certs'],
    responsibilities: 'Standard rank duties.'
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    const target = editingVacancy || externalForm;
    if (target) {
      setFormData({
        id: target.id || editingVacancyId || Date.now(),
        title: target.title || target.rank || '',
        rank: target.rank || '',
        vesselType: target.vesselType || '',
        dwt: target.dwt || '47,000 DWT',
        salary: target.salary || '',
        contract: target.contract || '',
        joiningPort: target.joiningPort || '',
        joiningDate: target.joiningDate || '',
        urgent: !!target.urgent,
        active: target.active !== undefined ? target.active : true,
        requirements: target.requirements || ['Valid STCW Certs'],
        responsibilities: target.responsibilities || 'Standard rank duties.'
      });
    } else {
      setFormData(defaultForm);
    }
  }, [isOpen, editingVacancy, editingVacancyId, externalForm]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (setExternalForm) {
      setExternalForm(prev => (typeof prev === 'object' && prev ? { ...prev, [field]: value } : { [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalData = {
      ...formData,
      title: formData.title || formData.rank || 'Vacancy',
      id: formData.id || Date.now()
    };
    if (onSave) onSave(finalData);
    if (onClose) onClose();
  };

  const isEdit = !!(editingVacancy || editingVacancyId);

  return (
    <div className="modal-overlay" style={{ zIndex: 2000, paddingTop: '85px', paddingBottom: '2rem', overflowY: 'auto', alignItems: 'flex-start' }}>
      <div className="modal-content" style={{ maxWidth: '650px', padding: '2rem', marginTop: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
            {isEdit ? '✏️ Редактировать Вакансию' : '➕ Добавить Новую Вакансию'}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Заголовок вакансии</label>
            <input 
              type="text" 
              placeholder="e.g. Master / Chief Engineer" 
              className="form-input"
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Должность</label>
              <select 
                className="form-select"
                value={formData.rank || ''}
                onChange={(e) => updateField('rank', e.target.value)}
              >
                <option value="">-- SELECT (Выберите должность) --</option>
                {MARITIME_RANKS.map((r) => (
                  <option key={r} value={r}>{getRankLabel(r, lang)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Тип судна</label>
              <select 
                className="form-select"
                value={formData.vesselType || ''}
                onChange={(e) => updateField('vesselType', e.target.value)}
              >
                <option value="">-- SELECT (Выберите тип судна) --</option>
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
                value={formData.salary || ''}
                onChange={(e) => updateField('salary', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Длительность контракта</label>
              <input 
                type="text" 
                placeholder="Контракт (e.g. 4 months)"
                className="form-input"
                value={formData.contract || ''}
                onChange={(e) => updateField('contract', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Характеристики судна / DWT</label>
              <input 
                type="text" 
                placeholder="e.g. 47,000 DWT"
                className="form-input"
                value={formData.dwt || ''}
                onChange={(e) => updateField('dwt', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Порт посадки</label>
              <input 
                type="text" 
                placeholder="e.g. Rotterdam, Netherlands"
                className="form-input"
                value={formData.joiningPort || ''}
                onChange={(e) => updateField('joiningPort', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Дата готовности / Посадки</label>
            <input 
              type="text" 
              placeholder="e.g. 15.08.2026"
              className="form-input"
              value={formData.joiningDate || ''}
              onChange={(e) => updateField('joiningDate', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.4rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-danger)', fontWeight: 600 }}>
              <input 
                type="checkbox"
                checked={!!formData.urgent}
                onChange={(e) => updateField('urgent', e.target.checked)}
              />
              🔥 Срочная вакансия (HOT / URGENT)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-emerald)', fontWeight: 600 }}>
              <input 
                type="checkbox"
                checked={formData.active !== false}
                onChange={(e) => updateField('active', e.target.checked)}
              />
              👁️ Отображать на сайте
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Сохранить изменения' : 'Создать вакансию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
