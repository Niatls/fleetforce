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
    rank: MARITIME_RANKS[0],
    vesselType: VESSEL_TYPES[0],
    dwt: '47,000 DWT',
    salary: '$8,500',
    contract: '4 months',
    joiningPort: 'Rotterdam, Netherlands',
    joiningDate: '15.08.2026',
    urgent: false,
    active: true
  };

  const [localForm, setLocalForm] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    if (editingVacancy) {
      setLocalForm({
        id: editingVacancy.id,
        title: editingVacancy.title || editingVacancy.rank || '',
        rank: editingVacancy.rank || MARITIME_RANKS[0],
        vesselType: editingVacancy.vesselType || VESSEL_TYPES[0],
        dwt: editingVacancy.dwt || '',
        salary: editingVacancy.salary || '',
        contract: editingVacancy.contract || '',
        joiningPort: editingVacancy.joiningPort || '',
        joiningDate: editingVacancy.joiningDate || '',
        urgent: !!editingVacancy.urgent,
        active: editingVacancy.active !== undefined ? editingVacancy.active : true
      });
    } else if (externalForm) {
      setLocalForm(externalForm);
    } else {
      setLocalForm(defaultForm);
    }
  }, [isOpen, editingVacancy, externalForm]);

  if (!isOpen) return null;

  const currentForm = externalForm || localForm;

  const updateField = (field, value) => {
    if (setExternalForm && externalForm) {
      setExternalForm({ ...externalForm, [field]: value });
    } else {
      setLocalForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVacancy) {
      onSave({ ...localForm, id: editingVacancy.id });
    } else if (externalForm) {
      onSave(e);
    } else {
      onSave({ ...localForm, id: Date.now() });
    }
  };

  const isEdit = !!(editingVacancy || editingVacancyId);

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '620px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
            {isEdit ? 'Редактировать Вакансию' : t('admin.addVacancyBtn')}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Заголовок вакансии</label>
            <input 
              type="text" 
              required
              placeholder={t('admin.vacTitle')}
              className="form-input"
              value={currentForm.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Должность</label>
              <select 
                className="form-select"
                value={currentForm.rank || ''}
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
                value={currentForm.vesselType || ''}
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
                value={currentForm.salary || ''}
                onChange={(e) => updateField('salary', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Длительность контракта</label>
              <input 
                type="text" 
                placeholder="Контракт (e.g. 4 months)"
                className="form-input"
                value={currentForm.contract || ''}
                onChange={(e) => updateField('contract', e.target.value)}
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
                value={currentForm.dwt || ''}
                onChange={(e) => updateField('dwt', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Порт посадки</label>
              <input 
                type="text" 
                placeholder="Роттердам, Нидерланды"
                className="form-input"
                value={currentForm.joiningPort || ''}
                onChange={(e) => updateField('joiningPort', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Дата готовности</label>
            <input 
              type="text" 
              placeholder="15.08.2026"
              className="form-input"
              value={currentForm.joiningDate || ''}
              onChange={(e) => updateField('joiningDate', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={!!currentForm.urgent}
                onChange={(e) => updateField('urgent', e.target.checked)}
              />
              <span style={{ color: currentForm.urgent ? 'var(--color-danger)' : 'var(--text-primary)', fontWeight: 600 }}>Пометить как СРОЧНАЯ! (HOT)</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-accent">
              {isEdit ? 'Сохранить изменения' : t('admin.saveVacBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
