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
import { X, FileText, Check, UploadCloud, Sparkles, Brain, AlertTriangle } from 'lucide-react';

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

  const handleRetryHandwritten = useCallback(async () => {
    setError(null);
    setStep('processing');

    try {
      let response: SmartImportResponse;
      if (selectedFiles.length === 0) {
        throw new Error('No files to retry scanning.');
      }
      const allImages = selectedFiles.every(f => IMAGE_TYPES.has(f.type));
      if (allImages && selectedFiles.length > 1) {
        response = await importMultipleImages(nodeId, selectedFiles, 'handwritten', nodeTitle, nodeType);
      } else {
        response = await importSingleFile(nodeId, selectedFiles[0], 'handwritten', nodeTitle, nodeType);
      }
      setResult(response);
      setStep('review');
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? 'Import failed. Please try again.';
      setError(msg);
      setStep('select');
    }
  }, [nodeId, selectedFiles, nodeTitle, nodeType]);

  // ── Render ─────────────────────────────────────────────────────────────

  if (step === 'review' && result) {
    return (
      <ReviewScreen
        result={result}
        nodeId={nodeId}
        nodeTitle={nodeTitle}
        onBack={() => setStep('select')}
        onSaved={() => { onSaved?.(); onClose(); }}
        onRetryHandwritten={selectedFiles.length > 0 ? handleRetryHandwritten : undefined}
      />
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-surface-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-surface-void border border-border-default rounded-2xl p-8 flex flex-col items-center gap-4 min-w-[280px] shadow-shadow-lg">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-primary font-display font-semibold text-sm">Analyzing your notes...</p>
          <p className="text-text-secondary text-xs text-center font-body">
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
    <div className="fixed inset-0 bg-surface-void/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-void border border-border-default rounded-2xl w-full max-w-2xl shadow-shadow-lg overflow-hidden flex flex-col font-body">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-default bg-surface-base/30">
          <h2 className="text-text-primary font-display font-bold text-base">Import from Notes</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="bg-error-bg border border-error-border text-error-text text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-border-default pb-0.5">
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 pb-3 text-xs font-display font-bold transition-colors relative cursor-pointer ${
                activeTab === 'file'
                  ? 'text-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              File Upload
              {activeTab === 'file' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 pb-3 text-xs font-display font-bold transition-colors relative cursor-pointer ${
                activeTab === 'text'
                  ? 'text-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Paste Text
              {activeTab === 'text' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
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
                    ? 'border-primary bg-primary/10'
                    : selectedFiles.length > 0
                      ? 'border-primary/40 bg-primary/5 cursor-default'
                      : 'border-border-default hover:border-border-strong hover:bg-surface-hover/20'
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
                        <div key={i} className="flex items-center justify-between bg-surface-raised/60 px-3 py-1.5 rounded-lg border border-border-default">
                          <span className="text-primary text-xs truncate pr-2 flex items-center gap-1.5 font-mono">
                            <FileText className="w-3.5 h-3.5 text-primary" />
                            {f.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="text-text-secondary hover:text-error-text p-1 hover:bg-surface-hover rounded transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-3 pt-1 font-mono text-xs">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-text-primary hover:text-white border border-border-default hover:border-border-strong px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Change Files
                      </button>
                      <button
                        onClick={handleClearFiles}
                        className="text-error-text hover:text-error-text/85 border border-error-border px-3 py-1.5 rounded-lg transition-colors cursor-pointer bg-error-bg/30"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-2">
                    <UploadCloud className="w-8 h-8 text-text-secondary" />
                    <div>
                      <p className="text-text-primary text-sm font-semibold mb-1">Drop files here or click to upload</p>
                      <p className="text-text-tertiary text-xs">PDF, DOCX, TXT, or up to 5 images (JPG/PNG/WEBP)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Quality Selector */}
              {allImages && (
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary font-mono uppercase tracking-wider font-medium">Handwriting quality</label>
                  <div className="flex gap-2">
                    {(['auto', 'printed', 'handwritten'] as ImageQuality[]).map(q => (
                      <button
                        key={q}
                        onClick={() => setImageQuality(q)}
                        className={`flex-1 text-xs py-2 rounded-lg border transition-colors font-mono cursor-pointer ${
                          imageQuality === q
                            ? 'bg-primary/20 border-border-brand text-primary font-semibold'
                            : 'border-border-default text-text-secondary hover:border-border-strong'
                        }`}
                      >
                        {q.charAt(0).toUpperCase() + q.slice(1)}
                      </button>
                    ))}
                  </div>
                  {imageQuality === 'handwritten' && (
                    <p className="text-xs text-primary flex items-center gap-1 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Vision enabled — best for cursive and mixed-script handwriting
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary font-mono uppercase tracking-wider font-medium">Paste text directly</label>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste your notes, article text, or any study material here..."
                rows={6}
                className="w-full bg-surface-base border border-border-default rounded-lg p-3 text-sm text-text-primary placeholder-text-tertiary/50 resize-none focus:outline-none focus:border-border-brand font-body leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pb-5 bg-surface-void pt-2">
          <button onClick={onClose} className="text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer font-mono">
            Cancel
          </button>
          <button
            onClick={runImport}
            disabled={
              activeTab === 'file'
                ? selectedFiles.length === 0
                : !pasteText.trim()
            }
            className="bg-primary hover:bg-primary-fixed-dim disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-display font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-md flex items-center gap-1.5 cursor-pointer border-b border-[#005049]"
          >
            <Brain className="w-3.5 h-3.5" /> Generate Cards
          </button>
        </div>
      </div>
    </div>
  );
}
