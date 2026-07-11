'use client';
import { useState, useRef, useCallback } from 'react';
import adminApi from '@/lib/adminApi';
import toast from 'react-hot-toast';
import { Upload, Link, X, Loader2, Image as ImageIcon, Film, FileText } from 'lucide-react';

/**
 * MediaUploader — Dual-mode image/video uploader for admin forms.
 * Props:
 *   value      {string}   — current URL (typed or uploaded)
 *   onChange   {fn}       — called with new URL string
 *   label      {string}   — field label
 *   accept     {string}   — mime types for file input (default: image/*,video/*)
 *   placeholder {string}  — URL input placeholder
 */
export default function MediaUploader({
  value = '',
  onChange,
  label = 'Image',
  accept = 'image/*,video/*',
  placeholder = 'https://...',
}) {
  const [tab, setTab] = useState('url'); // 'url' | 'upload'
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(''); // track uploaded (vs typed) URL
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const isVideo = (url) => /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
  const isUploaded = value && value === uploadedUrl;

  const doUpload = useCallback(async (file) => {
    if (!file) return;
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi)$/i;
    if (!allowed.test(file.name)) {
      toast.error('Only images and videos are allowed');
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large. Max 10MB allowed.');
      return;
    }

    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // If there's a previous uploaded file, delete it first
      if (isUploaded && uploadedUrl) {
        try { await adminApi.delete(`/upload?url=${encodeURIComponent(uploadedUrl)}`); } catch {}
      }

      const res = await adminApi.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      const url = res.data.data.url;
      setUploadedUrl(url);
      onChange(url);
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [uploadedUrl, isUploaded, onChange]);

  const handleDelete = async () => {
    if (isUploaded && uploadedUrl) {
      try {
        await adminApi.delete(`/upload?url=${encodeURIComponent(uploadedUrl)}`);
        toast.success('File deleted');
      } catch {}
    }
    setUploadedUrl('');
    onChange('');
  };
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  }, [doUpload]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div>
      <label className="admin-label">{label}</label>

      {/* Tab switcher */}
      <div className="flex mb-2 rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(51,65,85,0.6)', width: 'fit-content' }}>
        {[
          { id: 'url', icon: Link, text: 'URL' },
          { id: 'upload', icon: Upload, text: 'Upload' },
        ].map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: tab === t.id ? '#dc2626' : 'rgba(15,23,42,0.8)',
              color: tab === t.id ? 'white' : '#64748b',
              border: 'none', cursor: 'pointer',
            }}>
            <t.icon className="w-3.5 h-3.5" />
            {t.text}
          </button>
        ))}
      </div>

      {/* URL Tab */}
      {tab === 'url' && (
        <input
          type="text"
          className="admin-input"
          value={value}
          onChange={e => { setUploadedUrl(''); onChange(e.target.value); }}
          placeholder={placeholder}
        />
      )}

      {/* Upload Tab */}
      {tab === 'upload' && (
        <div>
          {/* Drop Zone */}
          {!value && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragging ? '#dc2626' : '#334155'}`,
                background: dragging ? 'rgba(220,38,38,0.05)' : 'rgba(15,23,42,0.6)',
                padding: '2rem 1rem',
              }}>
              {uploading ? (
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                  <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#dc2626' }} />
                  <div className="w-full rounded-full h-1.5" style={{ background: '#1e293b' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: '#dc2626' }} />
                  </div>
                  <p className="text-xs" style={{ color: '#64748b' }}>{progress}% uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8" style={{ color: dragging ? '#dc2626' : '#475569' }} />
                  <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>
                    Drop file here or <span style={{ color: '#ef4444' }}>click to browse</span>
                  </p>
                  <p className="text-xs" style={{ color: '#475569' }}>Images &amp; Videos — Max 10MB</p>
                </>
              )}
            </div>
          )}

          {/* Preview after upload */}
          {value && (
            <div className="relative rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(51,65,85,0.6)', background: 'rgba(15,23,42,0.8)' }}>
              {isVideo(value) ? (
                <video src={value} controls className="w-full rounded-xl" style={{ maxHeight: '200px' }} />
              ) : (
                <div className="relative">
                  <img src={value} alt="preview" className="w-full rounded-xl object-cover"
                    style={{ maxHeight: '200px' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
              {/* File info bar */}
              <div className="flex items-center justify-between px-3 py-2"
                style={{ borderTop: '1px solid rgba(51,65,85,0.4)' }}>
                <div className="flex items-center gap-2 min-w-0">
                  {isVideo(value)
                    ? <Film className="w-4 h-4 flex-shrink-0" style={{ color: '#a78bfa' }} />
                    : <ImageIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#60a5fa' }} />}
                  <p className="text-xs truncate" style={{ color: '#94a3b8', maxWidth: '200px' }}>
                    {value.split('/').pop() || 'Uploaded file'}
                  </p>
                  {isUploaded && (
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', flexShrink: 0 }}>
                      Uploaded
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-2 py-1 rounded transition-all"
                    style={{ background: 'rgba(51,65,85,0.5)', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>
                    Replace
                  </button>
                  <button type="button" onClick={handleDelete}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', cursor: 'pointer' }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ''; }}
          />
        </div>
      )}
    </div>
  );
}
