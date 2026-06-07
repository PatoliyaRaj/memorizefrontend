'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReviewScreen } from './ReviewScreen';
import type { SmartImportPayload } from '@/services/import-service';
import { runSmartImport } from '@/services/import-service';

type Step = 'upload' | 'processing' | 'review';

interface Props { nodeId: string; nodeTitle: string; nodeType: string; onSaved: () => void; onClose: () => void; }

export function SmartImportModal({ nodeId, nodeTitle, nodeType, onSaved, onClose }: Props) {
  const [step, setStep] = useState<Step>('upload');
  const [tab, setTab] = useState<'file' | 'text'>('file');
  const [quality, setQuality] = useState<'auto' | 'printed' | 'handwritten'>('auto');
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [result, setResult] = useState<SmartImportPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: { 
      'application/pdf': ['.pdf'], 
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'], 
      'text/plain': ['.txt', '.md'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
    },
    onDrop: (files) => files[0] && setFile(files[0]),
  });

  async function handleExtract() {
    if (tab === 'file' && !file) { setError('Please select a file.'); return; }
    if (tab === 'text' && !pasteText.trim()) { setError('Please enter some text.'); return; }
    setError(null); setStep('processing');
    try {
      const form = new FormData();
      form.append('nodeId', nodeId);
      form.append('nodeTitle', nodeTitle);
      form.append('nodeType', nodeType);
      form.append('imageQuality', quality);
      if (tab === 'file') form.append('file', file!);
      else form.append('textContent', pasteText);
      const data = await runSmartImport(form);
      setResult(data);
      setStep('review');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Extraction failed.');
      setStep('upload');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">

        {step === 'upload' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <header className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Import to "{nodeTitle}"</h2>
                <p className="text-slate-400 text-sm mt-1">Upload a file or paste text — AI structures it and generates up to 10 study cards.</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl leading-none">✕</button>
            </header>

            <div className="flex border-b border-slate-800 mb-6">
              {(['file', 'text'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`py-2 px-4 border-b-2 text-sm font-medium transition-colors capitalize ${tab === t ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>{t === 'file' ? 'Upload File' : 'Paste Text'}</button>
              ))}
            </div>

            {error && <div className="bg-red-950/50 border border-red-900 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            {tab === 'file' ? (
              <div className="space-y-4">
                <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-700 hover:border-slate-600'}`}>
                   <input {...getInputProps()} />
                  <span className="text-4xl mb-3">📂</span>
                  <p className="text-slate-300 font-medium">Drop your file here or click to browse</p>
                  <p className="text-slate-500 text-xs mt-1">PDF (20MB), PNG/JPG/WEBP (5MB), TXT, MD, DOCX</p>
                </div>
                {file && (
                  <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <span className="text-slate-200 text-sm">{file.name} — {(file.size / 1024).toFixed(0)} KB</span>
                    <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </div>
                )}
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <span className="text-slate-300 text-sm font-medium block mb-2">OCR Mode (for images)</span>
                  <div className="flex gap-5">
                    {(['auto', 'printed', 'handwritten'] as const).map(m => (
                      <label key={m} className="flex items-center gap-1.5 text-slate-400 text-sm cursor-pointer capitalize">
                        <input type="radio" name="q" checked={quality === m} onChange={() => setQuality(m)} className="accent-indigo-500" /> {m}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                value={pasteText} onChange={e => setPasteText(e.target.value)}
                placeholder="Paste your study notes here (Markdown or plain text)..."
                className="flex-1 w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none min-h-[250px]"
              />
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm">Cancel</button>
              <button onClick={handleExtract} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md transition-colors">
                Extract & Generate →
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-5" />
            <h3 className="text-lg font-bold text-slate-100">Analysing your notes…</h3>
            <div className="mt-4 space-y-2 text-center">
              {['Extracting text', 'Detecting language', 'Structuring content', 'Generating flashcards'].map((s, i) => (
                <p key={i} className="text-slate-500 text-sm">{s}…</p>
              ))}
            </div>
          </div>
        )}

        {step === 'review' && result && (
          <ReviewScreen result={result} nodeId={nodeId} nodeTitle={nodeTitle} onBack={() => setStep('upload')} onSaved={onSaved} />
        )}

      </div>
    </div>
  );
}
