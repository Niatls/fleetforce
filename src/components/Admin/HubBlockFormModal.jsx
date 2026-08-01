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

  const [localForm, setLocalForm] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    if (editingBlock) {
      setLocalForm({
        id: editingBlock.id,
        title: editingBlock.title || '',
        description: editingBlock.description || '',
        buttonText: editingBlock.buttonText || '',
        actionType: editingBlock.actionType || 'download',
        filename: editingBlock.filename || '',
        fileData: editingBlock.fileData || null,
        linkUrl: editingBlock.linkUrl || '',
        iconType: editingBlock.iconType || 'FileText',
        color: editingBlock.color || 'blue',
        active: editingBlock.active !== undefined ? editingBlock.active : true
      });
    } else if (externalForm) {
      setLocalForm(externalForm);
    } else {
      setLocalForm(defaultForm);
    }
  }, [isOpen, editingBlock, externalForm]);

  if (!isOpen) return null;

  const currentForm = externalForm || localForm;

  const updateField = (field, value) => {
    if (setExternalForm && externalForm) {
      setExternalForm({ ...externalForm, [field]: value });
    } else {
      setLocalForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (externalFileSelect) {
      externalFileSelect(e);
      return;
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
    e.preventDefault();
    if (editingBlock) {
      onSave({ ...localForm, id: editingBlock.id });
    } else if (externalForm) {
      onSave(e);
    } else {
      onSave({ ...localForm, id: Date.now() });
    }
  };

  const isEdit = !!(editingBlock || editingHubId);

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '620px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
            {isEdit ? 'Редактировать Инфо-Блок' : 'Добавить Новый Инфо-Блок'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Заголовок блока</label>
            <input 
              type="text" 
              required
              placeholder="BGI Standard Application"
              className="form-input"
              value={currentForm.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание блока</label>
            <textarea 
              className="form-textarea"
              style={{ height: '75px' }}
              placeholder="Описание бланка или услуги..."
              value={currentForm.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Текст на кнопке</label>
              <input 
                type="text" 
                required
                placeholder="Скачать анкету (.PDF)"
                className="form-input"
                value={currentForm.buttonText || ''}
                onChange={(e) => updateField('buttonText', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Тип действия кнопки</label>
              <select 
                className="form-select"
                value={currentForm.actionType || 'download'}
                onChange={(e) => updateField('actionType', e.target.value)}
              >
                <option value="download">Скачивание файла (download)</option>
                <option value="wizard">Открыть Мастер Анкеты (wizard)</option>
                <option value="link">Переход по ссылке / Телефон (link)</option>
              </select>
            </div>
          </div>

          {currentForm.actionType === 'download' && (
            <div style={{ display: 'grid', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: 'var(--color-accent)' }}>📎 Загрузить файл с компьютера (.docx, .pdf, .zip, .xlsx)</label>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="form-input"
                  style={{ padding: '0.5rem', cursor: 'pointer' }}
                />
              </div>

              {currentForm.fileData && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-emerald)', background: 'var(--color-emerald-light)', padding: '0.5rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={15} /> Файл прикреплен и готов к скачиванию: <strong>{currentForm.filename}</strong>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Имя файла при сохранении пользователем</label>
                <input 
                  type="text" 
                  placeholder="Crew_Application_Form.pdf"
                  className="form-input"
                  value={currentForm.filename || ''}
                  onChange={(e) => updateField('filename', e.target.value)}
                />
              </div>
            </div>
          )}

          {currentForm.actionType === 'link' && (
            <div className="form-group">
              <label className="form-label">Ссылка / Телефон (tel:)</label>
              <input 
                type="text" 
                placeholder="tel:+78005553535"
                className="form-input"
                value={currentForm.linkUrl || ''}
                onChange={(e) => updateField('linkUrl', e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Тип иконки</label>
              <select 
                className="form-select"
                value={currentForm.iconType || 'FileText'}
                onChange={(e) => updateField('iconType', e.target.value)}
              >
                <option value="FileText">FileText (Документ)</option>
                <option value="Download">Download (Скачивание)</option>
                <option value="FileCheck">FileCheck (Галочка / Чек-лист)</option>
                <option value="Award">Award (Награда / Тесты)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Цветовой акцент</label>
              <select 
                className="form-select"
                value={currentForm.color || 'blue'}
                onChange={(e) => updateField('color', e.target.value)}
              >
                <option value="blue">Синий (Blue)</option>
                <option value="gold">Золотой (Gold)</option>
                <option value="emerald">Изумрудный (Emerald)</option>
                <option value="danger">Красный (Danger)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-accent">
              Сохранить Инфо-Блок
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
