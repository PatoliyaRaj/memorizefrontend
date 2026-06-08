'use client';

/**
 * Smart Import Modal — 3-Step Import Flow
 *
 * Step 1: Choose input method (file upload / multi-image / paste text)
 * Step 2: Processing (loading state with method label)
 * Step 3: ReviewScreen (edit + confirm)
 *
 * UX improvements:
 *  - Images auto-set imageQuality to 'handwritten' (eliminates the "orkicle" class of error)
 *  - Multi-image support: up to 5 photos with preview list
 *  - Drag-and-drop file area with format hints
 *  - Smart routing: multi-image vs single file vs paste
 */

import { useState, useRef, useCallback } from 'react';
import { ReviewScreen }                  from './ReviewScreen';
import {
  importSingleFile,
  importMultipleImages,
  importFromText,
  type ImageQuality,
  type SmartImportResponse,
}                                        from '@/services/import-service';

interface Props {
  nodeId:     string;
  nodeTitle?: string;
  nodeType?:  string;
  onClose:    () => void;
  onSaved?:   () => void;
}

type Step = 'select' | 'processing' | 'review';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function SmartImportModal({ nodeId, nodeTitle, nodeType, onClose, onSaved }: Props) {
  const [step,          setStep]          = useState<Step>('select');
  const [result,        setResult]        = useState<SmartImportResponse | null>(null);
  const [error,         setError]         = useState<string | null>(null);
  const [isDragging,    setIsDragging]    = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageQuality,  setImageQuality]  = useState<ImageQuality>('auto');
  const [pasteText,     setPasteText]     = useState('');
  const [activeTab,     setActiveTab]     = useState<'file' | 'text'>('file');
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  // ── File Selection ─────────────────────────────────────────────────────

  const handleFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;

    const allImages = arr.every(f => IMAGE_TYPES.has(f.type));

    if (allImages) {
      // Auto-set handwritten for images — eliminates "orkicle"-class OCR errors
      setImageQuality('handwritten');
      setSelectedFiles(arr.slice(0, 5)); // Cap at 5 images
    } else {
      // PDF/docx/txt — single file only
      setSelectedFiles([arr[0]]);
      setImageQuality('auto');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleClearFiles = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFiles([]);
    setImageQuality('auto');
  };

  // ── Import Execution ───────────────────────────────────────────────────

  const runImport = async () => {
    setError(null);
    setStep('processing');

    try {
      let response: SmartImportResponse;

      if (activeTab === 'file') {
        if (selectedFiles.length === 0) {
          throw new Error('Please select a file first.');
        }
        const allImages = selectedFiles.every(f => IMAGE_TYPES.has(f.type));
        if (allImages && selectedFiles.length > 1) {
          // Multiple images → multi-page path
          response = await importMultipleImages(nodeId, selectedFiles, imageQuality, nodeTitle, nodeType);
        } else {
          // Single file (any type including single image)
          response = await importSingleFile(nodeId, selectedFiles[0], imageQuality, nodeTitle, nodeType);
        }
      } else {
        if (!pasteText.trim()) {
          throw new Error('Please paste text first.');
        }
        response = await importFromText(nodeId, pasteText.trim(), nodeTitle, nodeType);
      }

      setResult(response);
      setStep('review');
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? 'Import failed. Please try again.';
      setError(msg);
      setStep('select');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

  if (step === 'review' && result) {
    return (
      <ReviewScreen
        result={result}
        nodeId={nodeId}
        onBack={() => setStep('select')}
        onSaved={() => { onSaved?.(); onClose(); }}
      />
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-200 font-semibold">Analyzing your notes...</p>
          <p className="text-slate-500 text-xs text-center">
            {imageQuality === 'handwritten'
              ? 'Using AI Vision for handwriting recognition'
              : 'Extracting text and generating cards'}
          </p>
        </div>
      </div>
    );
  }

  const allImages = selectedFiles.length > 0 && selectedFiles.every(f => IMAGE_TYPES.has(f.type));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2lg">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-slate-100 font-semibold text-base">Import from Notes</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 text-lg" aria-label="Close">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="bg-red-950/40 border border-red-900 text-red-300 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-slate-800 pb-1">
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'file'
                  ? 'text-teal-400 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              File Upload
              {activeTab === 'file' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'text'
                  ? 'text-teal-400 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Paste Text
              {activeTab === 'text' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
              )}
            </button>
          </div>

          {activeTab === 'file' ? (
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => selectedFiles.length === 0 && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-teal-400 bg-teal-950/20'
                    : selectedFiles.length > 0
                      ? 'border-teal-600/40 bg-teal-950/5 cursor-default'
                      : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={e => e.target.files && handleFiles(e.target.files)}
                />
                {selectedFiles.length > 0 ? (
                  <div className="space-y-3" onClick={e => e.stopPropagation()}>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar px-2">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                          <span className="text-teal-300 text-xs truncate pr-2">✓ {f.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="text-slate-500 hover:text-red-400 text-xs px-1"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-3 pt-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-slate-300 hover:text-white text-xs border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Change Files
                      </button>
                      <button
                        onClick={handleClearFiles}
                        className="text-red-400 hover:text-red-300 text-xs border border-red-950/50 hover:border-red-900/80 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-300 text-sm mb-1">Drop files here or click to upload</p>
                    <p className="text-slate-500 text-xs">PDF, DOCX, TXT, or up to 5 images (JPG/PNG/WEBP)</p>
                  </>
                )}
              </div>

              {/* Image Quality Selector */}
              {allImages && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Handwriting quality</label>
                  <div className="flex gap-2">
                    {(['auto', 'printed', 'handwritten'] as ImageQuality[]).map(q => (
                      <button
                        key={q}
                        onClick={() => setImageQuality(q)}
                        className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                          imageQuality === q
                            ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                            : 'border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {q.charAt(0).toUpperCase() + q.slice(1)}
                      </button>
                    ))}
                  </div>
                  {imageQuality === 'handwritten' && (
                    <p className="text-xs text-teal-400">
                      ✓ AI Vision enabled — best for cursive and mixed-script handwriting
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Paste text directly</label>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste your notes, article text, or any study material here..."
                rows={6}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-teal-600 font-mono"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pb-5">
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-300">
            Cancel
          </button>
          <button
            onClick={runImport}
            disabled={
              activeTab === 'file'
                ? selectedFiles.length === 0
                : !pasteText.trim()
            }
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Generate Cards →
          </button>
        </div>
      </div>
    </div>
  );
}
