import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

export const HubBlockFormModal = ({
  isOpen,
  editingBlock,
  editingHubId,
  hubForm: externalForm,
  setHubForm: setExternalForm,
  onHubFileSelect: externalFileSelect,
  onClose,
  onSave
}) => {
  const defaultForm = {
    title: '',
    description: '',
    buttonText: 'Скачать анкету (.PDF)',
    actionType: 'download',
    filename: 'Crew_Application_Form.pdf',
    fileData: null,
    linkUrl: '',
    iconType: 'FileText',
    color: 'blue',
    active: true
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    const target = editingBlock || externalForm;
    if (target) {
      setFormData({
        id: target.id || editingHubId || Date.now(),
        title: target.title || '',
        description: target.description || '',
        buttonText: target.buttonText || '',
        actionType: target.actionType || 'download',
        filename: target.filename || '',
        fileData: target.fileData || null,
        linkUrl: target.linkUrl || '',
        iconType: target.iconType || 'FileText',
        color: target.color || 'blue',
        active: target.active !== undefined ? target.active : true
      });
    } else {
      setFormData(defaultForm);
    }
  }, [isOpen, editingBlock, editingHubId, externalForm]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (setExternalForm) {
      setExternalForm(prev => (typeof prev === 'object' && prev ? { ...prev, [field]: value } : { [field]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (externalFileSelect) {
      externalFileSelect(e);
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateField('fileData', ev.target.result);
        updateField('filename', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalData = {
      ...formData,
      title: formData.title || 'Hub Block',
      id: formData.id || Date.now()
    };
    if (onSave) onSave(finalData);
    if (onClose) onClose();
  };

  const isEdit = !!(editingBlock || editingHubId);

  return (
    <div className="modal-overlay" style={{ zIndex: 2000, paddingTop: '85px', paddingBottom: '2rem', overflowY: 'auto', alignItems: 'flex-start' }}>
      <div className="modal-content" style={{ maxWidth: '600px', padding: '2rem', marginTop: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
            {isEdit ? '✏️ Редактировать Блок Seafarer Hub' : '➕ Добавить Новый Блок'}
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
            <label className="form-label">Заголовок блока</label>
            <input 
              type="text" 
              placeholder="e.g. Морская Анкета (BGI Form)" 
              className="form-input"
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание блока</label>
            <textarea 
              rows={2}
              placeholder="Краткое описание назначения файла или ссылки..." 
              className="form-input"
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Тип действия</label>
              <select 
                className="form-select"
                value={formData.actionType || 'download'}
                onChange={(e) => updateField('actionType', e.target.value)}
              >
                <option value="download">📥 Скачивание файла</option>
                <option value="wizard">📝 Открыть онлайн-анкету</option>
                <option value="link">🔗 Внешняя ссылка / Телефон</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Текст на кнопке</label>
              <input 
                type="text" 
                placeholder="e.g. Скачать анкету (.PDF)" 
                className="form-input"
                value={formData.buttonText || ''}
                onChange={(e) => updateField('buttonText', e.target.value)}
              />
            </div>
          </div>

          {formData.actionType === 'download' && (
            <div className="form-group" style={{ background: 'rgba(0,139,255,0.08)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-accent)' }}>
              <label className="form-label">Прикреплённый файл</label>
              <input 
                type="file" 
                className="form-input"
                onChange={handleFileChange}
                style={{ cursor: 'pointer' }}
              />
              {formData.filename && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-emerald)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle size={14} /> Файл прикреплён: {formData.filename}
                </div>
              )}
            </div>
          )}

          {formData.actionType === 'link' && (
            <div className="form-group">
              <label className="form-label">URL ссылки или Телефон (tel:)</label>
              <input 
                type="text" 
                placeholder="e.g. https://example.com/file.pdf или tel:+78005553535" 
                className="form-input"
                value={formData.linkUrl || ''}
                onChange={(e) => updateField('linkUrl', e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Иконка блока</label>
              <select 
                className="form-select"
                value={formData.iconType || 'FileText'}
                onChange={(e) => updateField('iconType', e.target.value)}
              >
                <option value="FileText">📄 Документ (FileText)</option>
                <option value="Download">📥 Скачивание (Download)</option>
                <option value="FileCheck">✅ Проверенный (FileCheck)</option>
                <option value="Award">🏆 Награда / Сертификат (Award)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Цветовая гамма</label>
              <select 
                className="form-select"
                value={formData.color || 'blue'}
                onChange={(e) => updateField('color', e.target.value)}
              >
                <option value="blue">🔵 Синий (Accent)</option>
                <option value="emerald">🟢 Изумрудный (Emerald)</option>
                <option value="gold">🟡 Золотой (Gold)</option>
                <option value="danger">🔴 Красный (Danger)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.4rem' }}>
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
              {isEdit ? 'Сохранить изменения' : 'Создать блок'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
