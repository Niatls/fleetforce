import React from 'react';
import { FileText, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Check if file is a word doc
const isWordDoc = (file) =>
  file.name?.match(/\.(doc|docx)$/i) ||
  file.dataUrl?.includes('application/msword') ||
  file.dataUrl?.includes('application/vnd.openxmlformats-officedocument');

export const DocumentPreviewModal = ({
  previewFile,
  allFiles,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  if (!previewFile) return null;

  const hasNav = allFiles && allFiles.length > 1;
  const isImage = previewFile.dataUrl?.startsWith('data:image/') || previewFile.name?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
  const isPdf = previewFile.dataUrl?.startsWith('data:application/pdf') || previewFile.name?.endsWith('.pdf');
  const isDoc = isWordDoc(previewFile);

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '880px', width: '92%', padding: '1.8rem', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={22} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: 0, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{previewFile.name}</h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {hasNav ? `Файл ${(currentIndex ?? 0) + 1} из ${allFiles.length}` : 'Просмотр документа'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
            {/* Navigation arrows */}
            {hasNav && (
              <>
                <button
                  onClick={() => onNavigate(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
                  title="Предыдущий файл"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => onNavigate(currentIndex + 1)}
                  disabled={currentIndex === allFiles.length - 1}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: currentIndex === allFiles.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentIndex === allFiles.length - 1 ? 'not-allowed' : 'pointer', padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
                  title="Следующий файл"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            <a
              href={previewFile.dataUrl}
              download={previewFile.name}
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none', gap: '0.4rem' }}
            >
              <Download size={15} /> Скачать
            </a>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Viewer Container */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '380px' }}>
          {isImage ? (
            <img src={previewFile.dataUrl} alt={previewFile.name} style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} />
          ) : isPdf ? (
            <iframe src={previewFile.dataUrl} title={previewFile.name} style={{ width: '100%', height: '560px', border: 'none', borderRadius: '6px' }} />
          ) : isDoc ? (
            // .doc/.docx — cannot render natively in browser, show download prompt
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0,139,255,0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                <FileText size={38} />
              </div>
              <h5 style={{ color: '#FFFFFF', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                Документ Word ({previewFile.name?.split('.').pop()?.toUpperCase()})
              </h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Браузер не поддерживает встроенный просмотр файлов .doc/.docx.<br />
                Скачайте файл для просмотра в Microsoft Word или LibreOffice.
              </p>
              <a href={previewFile.dataUrl} download={previewFile.name} className="btn btn-primary" style={{ padding: '0.7rem 1.6rem', textDecoration: 'none' }}>
                <Download size={18} /> Скачать {previewFile.name}
              </a>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(0,139,255,0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                <FileText size={36} />
              </div>
              <h5 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.6rem', fontWeight: 600 }}>Скачать файл</h5>
              <a href={previewFile.dataUrl} download={previewFile.name} className="btn btn-primary" style={{ padding: '0.7rem 1.4rem', textDecoration: 'none' }}>
                <Download size={18} /> {previewFile.name}
              </a>
            </div>
          )}
        </div>

        {/* File strip navigation thumbnails */}
        {hasNav && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {allFiles.map((f, i) => (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                style={{
                  background: i === currentIndex ? 'var(--color-accent-light)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${i === currentIndex ? 'var(--color-accent)' : 'var(--border-color)'}`,
                  borderRadius: '6px',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  color: i === currentIndex ? 'var(--color-accent)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 0,
                }}
                title={f.name}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
