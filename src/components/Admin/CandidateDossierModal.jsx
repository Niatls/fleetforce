import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FileCheck, FileText, Printer, X, Paperclip, Plus, Eye, Download, Trash2 } from 'lucide-react';

export const CandidateDossierModal = ({
  candidate,
  onClose,
  onExportDoc,
  onAdminFileUpload,
  onAdminFileDelete,
  onPreviewFile,
  onSaveCandidateNotes
}) => {
  const { t } = useLanguage();
  if (!candidate) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content printable-cv" style={{ maxWidth: '850px', padding: '2.5rem' }}>
        
        {/* Screen Modal Actions */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCheck size={24} color="var(--color-accent)" />
            <h3 style={{ fontSize: '1.5rem' }}>{t('admin.dossierTitle')} - {candidate.id}</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onExportDoc(candidate)} className="btn btn-secondary btn-sm" style={{ color: 'var(--color-accent)', borderColor: 'rgba(0,139,255,0.4)', gap: '0.4rem' }}>
              <FileText size={15} /> Скачать DOC (.doc)
            </button>
            <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <Printer size={15} /> Печать / Скачать PDF (.pdf)
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Header (Visible on print) */}
        <div className="printable-header-only" style={{ borderBottom: '2px solid #003366', paddingBottom: '10px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#003366', margin: 0, textTransform: 'uppercase' }}>FleetForce Crewing Alliance</h2>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>International Seafarer Application Dossier | Ref: {candidate.id}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#555' }}>
              Date: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Dossier Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.6rem' }}>1. Personal Details / Личные данные</h4>
            <div style={{ fontSize: '0.9rem', display: 'grid', gap: '0.4rem' }}>
              <div><strong>Full Name / ФИО:</strong> {candidate.fullName}</div>
              <div><strong>Phone / Телефон:</strong> {candidate.phone}</div>
              <div><strong>Email / Эл. почта:</strong> {candidate.email}</div>
              <div><strong>Citizenship / Гражданство:</strong> {candidate.citizenship}</div>
              <div><strong>Date of Birth / Дата рождения:</strong> {candidate.dob}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.6rem' }}>2. Position & Qualification / Квалификация</h4>
            <div style={{ fontSize: '0.9rem', display: 'grid', gap: '0.4rem' }}>
              <div><strong>Applied Rank / Должность:</strong> {candidate.appliedRank}</div>
              <div><strong>Desired Salary / Оклад:</strong> ${candidate.minSalary} / month</div>
              <div><strong>Availability / Готовность:</strong> {candidate.readyDate}</div>
              <div><strong>Marlins Score / Английский:</strong> {candidate.marlinsScore} ({candidate.englishLevel})</div>
            </div>
          </div>
        </div>

        {/* Sea Experience Matrix */}
        <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.8rem' }}>3. Sea Experience Record Matrix / Опыт работы в море</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.6rem' }}>Vessel Name</th>
              <th style={{ padding: '0.6rem' }}>Type</th>
              <th style={{ padding: '0.6rem' }}>DWT / Engine</th>
              <th style={{ padding: '0.6rem' }}>Rank</th>
              <th style={{ padding: '0.6rem' }}>Sign On / Off</th>
            </tr>
          </thead>
          <tbody>
            {candidate.seaService?.map((s, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{s.vesselName || 'N/A'}</td>
                <td style={{ padding: '0.5rem' }}>{s.vesselType}</td>
                <td style={{ padding: '0.5rem' }}>{s.dwtGrt} / {s.engineBhp}</td>
                <td style={{ padding: '0.5rem' }}>{s.rankHeld}</td>
                <td style={{ padding: '0.5rem' }}>{s.dateFrom} — {s.dateTo}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Attached Candidate Documents */}
        <div className="no-print" style={{ marginBottom: '1.5rem', background: 'rgba(0,139,255,0.06)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(0,139,255,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <h4 style={{ color: 'var(--color-accent)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
              <Paperclip size={18} /> 4. Attached Documents / Прикрепленные файлы ({candidate.attachedFiles?.length || 0})
            </h4>

            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', gap: '0.4rem', color: 'var(--color-emerald)', borderColor: 'rgba(16,185,129,0.3)' }}>
              <Plus size={14} /> Добавить документ к анкете
              <input 
                type="file" 
                multiple 
                accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.zip" 
                style={{ display: 'none' }}
                onChange={(e) => onAdminFileUpload(candidate.id, e)} 
              />
            </label>
          </div>

          {candidate.attachedFiles && candidate.attachedFiles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.8rem' }}>
              {candidate.attachedFiles.map((file, fIdx) => (
                <div key={file.id || fIdx} style={{ background: 'var(--bg-surface)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                    <FileText size={20} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.name}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{file.size || 'Документ'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                    <button 
                      type="button"
                      onClick={() => onPreviewFile(file)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.3rem' }}
                      title="Просмотреть файл онлайн"
                    >
                      <Eye size={13} /> Просмотр
                    </button>
                    <a 
                      href={file.dataUrl} 
                      download={file.name} 
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none', gap: '0.3rem' }}
                      title="Скачать файл на устройство"
                    >
                      <Download size={13} /> Скачать
                    </a>
                    <button 
                      type="button"
                      onClick={() => onAdminFileDelete(candidate.id, file.id)}
                      style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '4px', cursor: 'pointer', padding: '0.3rem' }}
                      title="Удалить файл"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              К данной анкете пока не прикреплены файлы. Нажмите «Добавить документ к анкете», чтобы загрузить сканы дипломов или паспорта.
            </div>
          )}
        </div>

        {/* Manager Notes */}
        <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>{t('admin.recruiterNotes')}</h4>
          <textarea 
            className="form-textarea"
            style={{ height: '80px', marginBottom: '0.8rem' }}
            defaultValue={candidate.notes || ''}
            onBlur={(e) => onSaveCandidateNotes(candidate.id, e.target.value)}
          />
        </div>

      </div>
    </div>
  );
};
