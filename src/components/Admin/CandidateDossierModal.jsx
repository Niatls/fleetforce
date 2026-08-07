import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FileCheck, FileText, Printer, X, Paperclip, Plus, Eye, Download, Trash2 } from 'lucide-react';

export const CandidateDossierModal = ({
  candidate,
  onClose,
  onExportDoc,
  onExportPdf,
  onDeleteCandidate,
  onAdminFileUpload,
  onAdminFileDelete,
  onPreviewFile,
  onSaveCandidateNotes
}) => {
  const { t } = useLanguage();
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  if (!candidate) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content printable-cv" style={{ maxWidth: '950px', padding: '2.5rem', maxHeight: '92vh', overflowY: 'auto', position: 'relative' }}>
        
        {/* Close Button top-right */}
        <button 
          onClick={onClose} 
          className="no-print" 
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
          title="Close modal"
        >
          <X size={24} />
        </button>

        {/* Screen Modal Actions Header */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCheck size={24} color="var(--color-accent)" />
            <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Seafarer Dossier - {candidate.id}</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => onExportDoc && onExportDoc(candidate)} className="btn btn-secondary btn-sm" style={{ color: 'var(--color-accent)', borderColor: 'rgba(0,139,255,0.4)', gap: '0.4rem' }}>
              <FileText size={15} /> Export DOC (.docx)
            </button>
            <button onClick={() => onExportPdf && onExportPdf(candidate)} className="btn btn-secondary btn-sm" style={{ color: 'var(--color-emerald)', borderColor: 'rgba(16,185,129,0.4)', gap: '0.4rem' }}>
              <Download size={15} /> Export PDF (.pdf)
            </button>
            <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <Printer size={15} /> Печать
            </button>
            {confirmDelete ? (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDeleteCandidate) onDeleteCandidate(candidate.id);
                  setConfirmDelete(false);
                  onClose();
                }}
                className="btn btn-sm"
                style={{ background: 'var(--color-danger)', color: '#fff', border: 'none', gap: '0.4rem', fontWeight: 700 }}
                title="Нажмите ещё раз для подтверждения удаления"
              >
                ⚠️ Подтвердить удаление?
              </button>
            ) : (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                  setTimeout(() => setConfirmDelete(false), 4000);
                }} 
                className="btn btn-secondary btn-sm" 
                style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.4)', gap: '0.4rem' }}
                title="Удалить анкету моряка"
              >
                <Trash2 size={15} /> Удалить анкету
              </button>
            )}
          </div>
        </div>

        {/* Printable & Screen Application Form Header */}
        <div style={{ borderBottom: '2px solid var(--color-accent)', paddingBottom: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>APPLICATION FORM</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', marginTop: '4px', fontWeight: 600 }}>FLEETFORCE CREWING ALLIANCE</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div><strong>REF:</strong> {candidate.id}</div>
              <div><strong>Date:</strong> {new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>
        </div>

        {/* 1. GENERAL INFORMATION */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h4 style={{ background: 'rgba(0,139,255,0.15)', color: 'var(--color-accent)', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
            1. General Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem', fontSize: '0.88rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div><strong>Positions applied for:</strong> <span style={{ color: '#FFF', fontWeight: 700 }}>{candidate.appliedRank}</span></div>
              <div><strong>Date of readiness:</strong> {candidate.readyDate || '-'}</div>
              <div><strong>Min Desired Salary:</strong> ${candidate.minSalary || '0'} / month</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div><strong>Full Name:</strong> <span style={{ color: '#FFF', fontWeight: 700 }}>{candidate.fullName}</span></div>
              <div><strong>Date of Birth:</strong> {candidate.dob || '-'}</div>
              <div><strong>Nationality / Citizenship:</strong> {candidate.nationality || candidate.citizenship || '-'}</div>
              <div><strong>Place of Birth:</strong> {candidate.placeOfBirth || '-'}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div><strong>Contact Phone:</strong> {candidate.phone || '-'}</div>
              <div><strong>E-mail:</strong> {candidate.email || '-'}</div>
              <div><strong>Skype / Telegram:</strong> {candidate.skypeTelegram || '-'}</div>
              <div><strong>Home Address:</strong> {candidate.address || candidate.homeAddress || '-'}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div><strong>Marital status:</strong> {candidate.maritalStatus || 'Single'} (Children &lt;18: {candidate.childrenUnder18 || '0'})</div>
              <div><strong>Next of Kin:</strong> {candidate.kinName || '-'} ({candidate.kinRelation || '-'})</div>
              <div><strong>Next of Kin Phone:</strong> {candidate.kinPhone || '-'}</div>
              <div><strong>Marlins Score:</strong> {candidate.marlinsScore || 'N/A'} ({candidate.englishLevel || 'Good'})</div>
            </div>
          </div>

          <div style={{ marginTop: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Physical & Uniform Details:</strong> Height: {candidate.height || '-'} cm | Weight: {candidate.weight || '-'} kg | Overall Size: {candidate.overallSize || '-'} EUR | Shoes: {candidate.shoeSize || '-'} EUR | Eyes: {candidate.eyesColour || '-'} | Hair: {candidate.hairColour || '-'}
          </div>
        </div>

        {/* 2. MARINE EDUCATION */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h4 style={{ background: 'rgba(0,139,255,0.15)', color: 'var(--color-accent)', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
            2. Marine Education
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>College or Academy</th>
                <th style={{ padding: '0.5rem' }}>From</th>
                <th style={{ padding: '0.5rem' }}>Till</th>
                <th style={{ padding: '0.5rem' }}>Department / Degree</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{candidate.collegeName || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.collegeFrom || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.collegeTill || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.collegeDegree || 'Nautical / Engineering'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. PASSPORTS AND CERTIFICATES */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h4 style={{ background: 'rgba(0,139,255,0.15)', color: 'var(--color-accent)', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
            3. Passports & STCW Certificates
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Document</th>
                <th style={{ padding: '0.5rem' }}>Number</th>
                <th style={{ padding: '0.5rem' }}>Issued Date</th>
                <th style={{ padding: '0.5rem' }}>Valid Until</th>
                <th style={{ padding: '0.5rem' }}>Place</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>TRAVEL PASSPORT</td>
                <td style={{ padding: '0.5rem' }}>{candidate.passportNo || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.passportIssued || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.passportExpiry || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.passportPlace || '-'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>SEAMAN'S BOOK (SID)</td>
                <td style={{ padding: '0.5rem' }}>{candidate.seamanBookNo || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.seamanBookIssued || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.seamanBookExpiry || '-'}</td>
                <td style={{ padding: '0.5rem' }}>{candidate.seamanBookPlace || '-'}</td>
              </tr>
              {candidate.certificates?.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>{c.certName}</td>
                  <td style={{ padding: '0.5rem' }}>{c.certNo || '-'}</td>
                  <td style={{ padding: '0.5rem' }}>{c.certIssued || '-'}</td>
                  <td style={{ padding: '0.5rem' }}>{c.certValid || '-'}</td>
                  <td style={{ padding: '0.5rem' }}>{c.rankCapacity || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. PREVIOUS SEA SERVICE */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h4 style={{ background: 'rgba(0,139,255,0.15)', color: 'var(--color-accent)', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
            4. Previous Sea Service Matrix
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>From / To</th>
                  <th style={{ padding: '0.5rem' }}>Rank</th>
                  <th style={{ padding: '0.5rem' }}>Vessel Name</th>
                  <th style={{ padding: '0.5rem' }}>Shipowner</th>
                  <th style={{ padding: '0.5rem' }}>Type</th>
                  <th style={{ padding: '0.5rem' }}>DWT / Engine</th>
                  <th style={{ padding: '0.5rem' }}>Manning Co.</th>
                </tr>
              </thead>
              <tbody>
                {candidate.seaService?.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{(s.dateFrom || '-') + ' — ' + (s.dateTo || '-')}</td>
                    <td style={{ padding: '0.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>{s.rankHeld || '-'}</td>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>{s.vesselName || '-'}</td>
                    <td style={{ padding: '0.5rem' }}>{s.shipowner || '-'}</td>
                    <td style={{ padding: '0.5rem' }}>{s.vesselType || '-'}</td>
                    <td style={{ padding: '0.5rem' }}>{(s.dwtGrt || '-') + ' / ' + (s.engineBhp || '-')}</td>
                    <td style={{ padding: '0.5rem' }}>{s.manningCompany || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. PREVIOUS EMPLOYERS */}
        {candidate.employers && candidate.employers.length > 0 && (
          <div style={{ marginBottom: '1.8rem' }}>
            <h4 style={{ background: 'rgba(0,139,255,0.15)', color: 'var(--color-accent)', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
              5. Brief Information About Previous Employers
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Company</th>
                  <th style={{ padding: '0.5rem' }}>Person in Charge</th>
                  <th style={{ padding: '0.5rem' }}>Contact Details</th>
                </tr>
              </thead>
              <tbody>
                {candidate.employers.map((emp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>{emp.company || '-'}</td>
                    <td style={{ padding: '0.5rem' }}>{emp.personInCharge || '-'}</td>
                    <td style={{ padding: '0.5rem' }}>{emp.contactDetails || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Attached Candidate Documents */}
        <div className="no-print" style={{ marginBottom: '1.5rem', background: 'rgba(0,139,255,0.06)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(0,139,255,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <h4 style={{ color: 'var(--color-accent)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
              <Paperclip size={18} /> Attached Scans & Certificates ({candidate.attachedFiles?.length || 0})
            </h4>

            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', gap: '0.4rem', color: 'var(--color-emerald)', borderColor: 'rgba(16,185,129,0.3)' }}>
              <Plus size={14} /> Attach File to Candidate
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{file.size || 'Document'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                    <button 
                      type="button"
                      onClick={() => onPreviewFile(file)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.3rem' }}
                      title="Preview file online"
                    >
                      <Eye size={13} /> View
                    </button>
                    <a 
                      href={file.dataUrl} 
                      download={file.name} 
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none', gap: '0.3rem' }}
                      title="Download file"
                    >
                      <Download size={13} /> Download
                    </a>
                    <button 
                      type="button"
                      onClick={() => onAdminFileDelete(candidate.id, file.id)}
                      style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', borderRadius: '4px', cursor: 'pointer', padding: '0.3rem' }}
                      title="Delete file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No attached scans or documents yet. Click "Attach File to Candidate" to upload scans or diplomas.
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
