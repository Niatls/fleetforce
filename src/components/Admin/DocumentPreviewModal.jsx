import React from 'react';
import { FileText, Download, X } from 'lucide-react';

export const DocumentPreviewModal = ({
  previewFile,
  onClose
}) => {
  if (!previewFile) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '850px', width: '92%', padding: '1.8rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={22} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{previewFile.name}</h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Размер: {previewFile.size || 'Документ'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0 }}>
            <a 
              href={previewFile.dataUrl} 
              download={previewFile.name} 
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none', gap: '0.4rem' }}
            >
              <Download size={15} /> Скачать файл
            </a>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Viewer Container */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '380px' }}>
          {previewFile.dataUrl?.startsWith('data:image/') || previewFile.name?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
            <img src={previewFile.dataUrl} alt={previewFile.name} style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} />
          ) : previewFile.dataUrl?.startsWith('data:application/pdf') || previewFile.name?.endsWith('.pdf') ? (
            <iframe src={previewFile.dataUrl} title={previewFile.name} style={{ width: '100%', height: '550px', border: 'none', borderRadius: '6px' }} />
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(0,139,255,0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                <FileText size={36} />
              </div>
              <h5 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.6rem', fontWeight: 600 }}>Документ свободен для скачивания</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Файлы формата Word (.doc, .docx), архивы (.zip) и текстовые приложения предпросматриваются сразу при открытии на ПК или телефоне.
              </p>
              <a href={previewFile.dataUrl} download={previewFile.name} className="btn btn-accent" style={{ padding: '0.7rem 1.4rem' }}>
                <Download size={18} /> Скачать {previewFile.name}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
