import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Eye, FileText, Archive, Paperclip, Trash2 } from 'lucide-react';
import { MARITIME_RANKS, getRankLabel } from '../../data/initialData';
import { handleDownloadAllFiles } from './exportUtils';

export const CandidatesTab = ({
  candidates,
  searchCandidate,
  setSearchCandidate,
  filterStatus,
  setFilterStatus,
  filterRank,
  setFilterRank,
  onUpdateCandidateStatus,
  onDeleteCandidate,
  onSelectCandidate,
  onExportDoc,
}) => {
  const { lang, t } = useLanguage();

  const filteredCandidates = candidates.filter((cand) => {
    if (filterStatus && cand.status !== filterStatus) return false;
    if (filterRank && cand.appliedRank !== filterRank) return false;
    if (searchCandidate) {
      const q = searchCandidate.toLowerCase();
      const nameMatch = cand.fullName?.toLowerCase().includes(q);
      const emailMatch = cand.email?.toLowerCase().includes(q);
      const rankMatch = cand.appliedRank?.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch && !rankMatch) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Candidate Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            placeholder={t('admin.searchCandidate')}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
          />
        </div>

        <select 
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">{t('admin.filterStatus')}</option>
          <option value="New">{t('admin.statusNew')}</option>
          <option value="Under Review">{t('admin.statusReview')}</option>
          <option value="Approved">{t('admin.statusApproved')}</option>
          <option value="On Board">{t('admin.statusOnBoard')}</option>
          <option value="Archive">{t('admin.statusArchive')}</option>
        </select>

        <select 
          className="form-select"
          value={filterRank}
          onChange={(e) => setFilterRank(e.target.value)}
        >
          <option value="">Все должности</option>
          {MARITIME_RANKS.map((r) => (
            <option key={r} value={r}>{getRankLabel(r, lang)}</option>
          ))}
        </select>
      </div>

      {/* Candidates Table */}
      <div style={{ overflowX: 'auto', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>ID / {t('admin.colName')}</th>
              <th style={{ padding: '1rem' }}>{t('admin.colRank')}</th>
              <th style={{ padding: '1rem' }}>Marlins</th>
              <th style={{ padding: '1rem' }}>{t('admin.colReadyDate')}</th>
              <th style={{ padding: '1rem' }}>Документы</th>
              <th style={{ padding: '1rem' }}>{t('admin.colStatus')}</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>{t('admin.colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((cand) => (
              <tr key={cand.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{cand.fullName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)' }}>{cand.id} • {cand.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-blue">{cand.appliedRank}</span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-emerald)' }}>
                  {cand.marlinsScore || 'N/A'}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  {cand.readyDate}
                </td>
                <td style={{ padding: '1rem' }}>
                  {cand.attachedFiles && cand.attachedFiles.length > 0 ? (
                    <button 
                      onClick={() => onSelectCandidate(cand)}
                      className="badge badge-gold" 
                      style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                      title="Нажмите чтобы просмотреть прикрепленные файлы"
                    >
                      <Paperclip size={13} /> {cand.attachedFiles.length} {cand.attachedFiles.length === 1 ? 'файл' : 'файла'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Нет файлов</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    value={cand.status} 
                    onChange={(e) => onUpdateCandidateStatus(cand.id, e.target.value)}
                    className="form-select"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: cand.status === 'Approved' ? 'var(--color-emerald-light)' : 'rgba(255,255,255,0.05)', color: cand.status === 'Approved' ? 'var(--color-emerald)' : 'var(--text-primary)' }}
                  >
                    <option value="New">{t('admin.statusNew')}</option>
                    <option value="Under Review">{t('admin.statusReview')}</option>
                    <option value="Approved">{t('admin.statusApproved')}</option>
                    <option value="On Board">{t('admin.statusOnBoard')}</option>
                    <option value="Archive">{t('admin.statusArchive')}</option>
                  </select>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                    <button 
                      onClick={() => onSelectCandidate(cand)}
                      className="btn btn-secondary btn-sm"
                      title="Просмотреть анкету моряка"
                    >
                      <Eye size={14} /> Анкета
                    </button>
                    <button 
                      onClick={() => onExportDoc(cand)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-accent)', borderColor: 'rgba(0,139,255,0.3)', gap: '0.2rem' }}
                      title="Скачать анкету в формате Word (.doc)"
                    >
                      <FileText size={14} /> DOC
                    </button>
                    <button 
                      onClick={() => handleDownloadAllFiles(cand)}
                      className="btn btn-primary btn-sm"
                      title="Скачать ZIP-архив с анкетой (.doc) и всеми прикреплёнными документами"
                    >
                      <Archive size={14} /> Скачать всё
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const name = cand.fullNameRu || cand.fullNameEn || cand.fullName || cand.id;
                        if (window.confirm(`Вы действительно хотите удалить анкету кандидата "${name}"?`)) {
                          if (onDeleteCandidate) onDeleteCandidate(cand.id);
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.35rem 0.5rem' }}
                      title="Удалить анкету моряка"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
