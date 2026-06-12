'use client';

/**
 * Import Review Screen
 *
 * Split panel:
 *   Left:  Editable node fields (theory, reminders, anchor)
 *   Right: Cards grouped by subTopic (CardSubTopicGroup)
 *
 * UX improvements:
 *  - Traffic-light confidence display with actionable guidance messages
 *  - Method badge shows exactly how text was extracted
 *  - "Add card manually" for content the AI missed
 *  - Page count badge for multi-page documents
 *  - Re-import button (Back) with guidance
 */

import { useState }          from 'react';
import ReactMarkdown         from 'react-markdown';
import remarkGfm             from 'remark-gfm';
import rehypeSanitize        from 'rehype-sanitize';
import { CardSubTopicGroup } from './CardSubTopicGroup';
import { confirmImport }     from '@/services/import-service';
import type { SmartImportResponse, ImportCard } from '@/services/import-service';
import { FileText, Brain, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

interface Props {
  result:  SmartImportResponse;
  nodeId:  string;
  nodeTitle?: string;
  onBack:  () => void;
  onSaved: () => void;
  onRetryHandwritten?: () => void;
}

interface ReviewCard extends ImportCard {
  id:      string;
  keep:    boolean;
  editing: boolean;
}

function getConfidenceConfig(confidence: number, method: string) {
  if (method.includes('nvidia-vision')) {
    return {
      color:  'text-success-text',
      bg:     'bg-success-bg',
      border: 'border-success-border',
      label:  'Excellent',
      tip:    null,
    };
  }
  if (confidence >= 0.85) {
    return { color: 'text-success-text', bg: 'bg-success-bg', border: 'border-success-border', label: 'High', tip: null };
  }
  if (confidence >= 0.65) {
    return {
      color:  'text-warning-text',
      bg:     'bg-warning-bg',
      border: 'border-warning-border',
      label:  'Medium',
      tip:    'Review cards for OCR errors. Switch to "Handwritten" mode if text is cursive.',
    };
  }
  return {
    color:  'text-error-text',
    bg:     'bg-error-bg',
    border: 'border-error-border',
    label:  'Low',
    tip:    'OCR struggled with this content. Please switch to Handwritten mode or upload a clearer image.',
  };
}

function ConfidenceBadge({ confidence, method }: { confidence: number; method: string }) {
  let color = 'text-success-text bg-success-bg border-success-border';
  let label = `High (${Math.round(confidence * 100)}%)`;
  let dotColor = 'bg-emerald-500';

  if (method.includes('nvidia-vision')) {
    label = 'Excellent (Vision AI)';
    dotColor = 'bg-emerald-400';
  } else if (confidence >= 0.85) {
    label = `High (${Math.round(confidence * 100)}%)`;
    dotColor = 'bg-emerald-500';
  } else if (confidence >= 0.65) {
    color = 'text-warning-text bg-warning-bg border-warning-border';
    label = `Medium (${Math.round(confidence * 100)}%)`;
    dotColor = 'bg-amber-500';
  } else {
    color = 'text-error-text bg-error-bg border-error-border';
    label = `Low (${Math.round(confidence * 100)}%)`;
    dotColor = 'bg-red-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}

function normalizeBullets(text: string): string {
  return text
    .replace(/^~\s+/gm,  '- ')
    .replace(/^•\s+/gm,  '- ')
    .replace(/^–\s+/gm,  '- ')
    .replace(/^—\s+/gm,  '- ')
    .replace(/^>\s+/gm,  '- ')
    .trim();
}

export function ReviewScreen({ result, nodeId, nodeTitle, onBack, onSaved, onRetryHandwritten }: Props) {
  const [activeTab,    setActiveTab]    = useState<'content' | 'cards'>('content');
  const [theoryMode,   setTheoryMode]   = useState<'preview' | 'edit'>('preview');
  const [rememberMode, setRememberMode] = useState<'preview' | 'edit'>('preview');
  const [theory,    setTheory]    = useState(normalizeBullets(result.fields.theoryContent    ?? ''));
  const [remember,  setRemember]  = useState(normalizeBullets(result.fields.thingsToRemember ?? ''));
  const [anchor,    setAnchor]    = useState(result.fields.emotionalAnchor  ?? '');
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [reviewCards, setReviewCards] = useState<ReviewCard[]>(() =>
    result.cards.map((c, i) => ({
      ...c,
      id:      `card-${i}`,
      keep:    true,
      editing: false,
    })),
  );

  const conf    = result.confidence;
  const method  = result.method;
  const confCfg = getConfidenceConfig(conf, method);
  const keptCount = reviewCards.filter(c => c.keep).length;

  // ── Card Handlers ────────────────────────────────────────────────────────

  const toggleKeep   = (id: string) => setReviewCards(cs => cs.map(c => c.id === id ? { ...c, keep: !c.keep } : c));
  const toggleEdit   = (id: string) => setReviewCards(cs => cs.map(c => c.id === id ? { ...c, editing: !c.editing } : c));
  const editCard     = (id: string, key: 'question' | 'answer', val: string) =>
    setReviewCards(cs => cs.map(c => c.id === id ? { ...c, [key]: val } : c));
  const keepAll      = () => setReviewCards(cs => cs.map(c => ({ ...c, keep: true })));
  const removeAll    = () => setReviewCards(cs => cs.map(c => ({ ...c, keep: false })));
  const addBlankCard = () => setReviewCards(cs => [...cs, {
    id:       `card-manual-${Date.now()}`,
    question: '',
    answer:   '',
    subTopic: 'Manual',
    questionType: 'free_recall',
    type:     'definition',
    keep:     true,
    editing:  true,
  }]);

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    const keptCards = reviewCards.filter(c => c.keep && c.question.trim() && c.answer.trim());
    if (!keptCards.length && !theory.trim()) {
      setSaveError('Please ensure you have theory content or at least one complete card before saving.');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      await confirmImport({
        nodeId,
        fields: { theoryContent: theory, thingsToRemember: remember, emotionalAnchor: anchor },
        cards: keptCards.map(c => ({
          question:     c.question,
          answer:       c.answer,
          questionType: c.questionType || 'free_recall',
          subTopic:     c.subTopic,
          explanation:  c.explanation,
        })),
      });
      onSaved();
    } catch (err: any) {
      setSaveError(err?.response?.data?.error ?? 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const showRetryButton = conf < 0.72 && method.includes('tesseract') && onRetryHandwritten;

  return (
    <div className="fixed inset-0 bg-surface-void/95 backdrop-blur-md z-50 flex flex-col text-text-primary font-body border-l border-border-default">
      
      {/* 1. Header Metadata Panel */}
      <div className="p-4 border-b border-border-default bg-[#0A0F0E] flex flex-col gap-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="font-display font-bold text-text-primary text-sm tracking-wide">
            Review {nodeTitle ? `"${nodeTitle}"` : 'Imported Content'}
          </h2>
          <button onClick={onBack} className="text-xs text-text-brand hover:text-primary font-semibold transition-all flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 items-center">
          <span className="text-[11px] text-text-secondary font-mono">Method: <strong className="text-primary font-medium">{result.method}</strong></span>
          <span className="text-[11px] text-text-secondary font-mono">Language: <strong className="text-primary uppercase font-medium">{result.detectedLang}</strong></span>
          <ConfidenceBadge confidence={result.confidence} method={result.method} />
          {result.pageCount && result.pageCount > 1 && (
            <span className="text-[11px] text-text-secondary font-mono">Pages: <strong className="text-primary font-medium">{result.pageCount}</strong></span>
          )}
        </div>
        {showRetryButton && (
          <div className="flex items-center justify-between bg-warning-bg border border-warning-border rounded-lg p-2.5 mt-1 animate-pulse">
            <span className="text-[10px] text-warning-text flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Low confidence scan.
            </span>
            <button onClick={onRetryHandwritten} className="text-[10px] bg-amber-800 hover:bg-amber-700 text-white px-2 py-0.5 rounded font-semibold transition-all cursor-pointer">
              Try with AI Handwriting Mode
            </button>
          </div>
        )}
      </div>

      {/* 2. Unified Navigation Tabs */}
      <div className="flex border-b border-border-default bg-surface-base/30 px-2 flex-shrink-0">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-2.5 px-4 text-xs font-display font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Content Fields
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`py-2.5 px-4 text-xs font-display font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'cards' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Brain className="w-3.5 h-3.5" /> Study Cards ({keptCount})
        </button>
      </div>

      {/* 3. Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-surface-void">
        {activeTab === 'content' ? (
          <div className="space-y-5">
            {/* Theory Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary font-medium">Theory / Notes</label>
                <div className="flex bg-surface-base rounded p-0.5 border border-border-default">
                  {(['preview', 'edit'] as const).map(mode => (
                    <button key={mode} onClick={() => setTheoryMode(mode)}
                      className={`text-[10px] px-2.5 py-0.5 rounded capitalize transition-all font-mono font-bold cursor-pointer ${
                        theoryMode === mode ? 'bg-surface-hover text-primary' : 'text-text-secondary hover:text-text-primary'
                      }`}>
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              {theoryMode === 'edit' ? (
                <textarea value={theory} onChange={e => setTheory(e.target.value)} rows={12}
                  className="w-full bg-surface-base border border-border-default rounded-xl p-3 text-xs text-text-primary font-mono focus:outline-none focus:border-border-brand leading-relaxed" />
              ) : (
                <div className="w-full bg-surface-base/50 border border-border-default rounded-xl p-3 text-xs text-text-primary min-h-[150px] prose prose-invert prose-xs max-w-none [&_h2]:text-primary [&_h2]:text-sm [&_h2]:font-semibold [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-4 [&_li]:text-text-secondary [&_li]:marker:text-primary leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                    {theory || '*No theory content generated.*'}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Key Reminders Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary font-medium">Key Reminders</label>
                <div className="flex bg-surface-base rounded p-0.5 border border-border-default">
                  {(['preview', 'edit'] as const).map(mode => (
                    <button key={mode} onClick={() => setRememberMode(mode)}
                      className={`text-[10px] px-2.5 py-0.5 rounded capitalize transition-all font-mono font-bold cursor-pointer ${
                        rememberMode === mode ? 'bg-surface-hover text-primary' : 'text-text-secondary hover:text-text-primary'
                      }`}>
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              {rememberMode === 'edit' ? (
                <textarea value={remember} onChange={e => setRemember(e.target.value)} rows={6}
                  className="w-full bg-surface-base border border-border-default rounded-xl p-3 text-xs text-text-primary font-mono focus:outline-none focus:border-border-brand leading-relaxed" />
              ) : (
                <div className="w-full bg-surface-base/50 border border-border-default rounded-xl p-3 text-xs text-text-primary min-h-[80px] prose prose-invert prose-xs max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_li]:text-text-secondary [&_li]:marker:text-primary leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                    {remember || '*No reminders generated.*'}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Emotional Anchor */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-text-secondary font-medium">Memory Anchor</label>
              <textarea value={anchor} onChange={e => setAnchor(e.target.value)} rows={3}
                placeholder="The AI didn't generate a memory anchor. Add your own real-world connection..."
                className="w-full bg-surface-base border border-border-default rounded-xl p-3 text-xs text-text-primary resize-none focus:outline-none focus:border-border-brand leading-relaxed placeholder-text-disabled italic font-body" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 relative pb-10">
            <div className="flex items-center justify-between border-b border-border-default pb-2 flex-shrink-0">
              <span className="text-[11px] font-mono text-text-secondary">{keptCount} / {reviewCards.length} selected</span>
              <div className="flex gap-3">
                <button onClick={keepAll} className="text-[10px] text-success-text hover:text-success-text/85 font-mono font-medium cursor-pointer">Keep all</button>
                <button onClick={removeAll} className="text-[10px] text-text-tertiary hover:text-text-secondary font-mono font-medium cursor-pointer">Remove all</button>
                <button onClick={addBlankCard} className="text-[10px] text-primary hover:text-primary/85 font-mono font-medium cursor-pointer">+ Add Card</button>
              </div>
            </div>
            <CardSubTopicGroup cards={reviewCards} onToggleKeep={toggleKeep} onEditCard={editCard} onToggleEdit={toggleEdit} />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-surface-void to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* 4. Footer Save Action Drawer */}
      <div className="p-4 border-t border-border-default bg-[#0A0F0E] flex flex-col gap-3 flex-shrink-0">
        {saveError && <p className="text-xs text-error-text text-center font-body">{saveError}</p>}
        <button
          onClick={handleSave}
          disabled={saving || (keptCount === 0 && !theory.trim())}
          className="w-full bg-primary hover:bg-primary-fixed-dim disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-display font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-b border-[#005049]"
        >
          {saving ? 'Saving changes...' : <>Save Node + {keptCount} Card{keptCount !== 1 ? 's' : ''} <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </div>

    </div>
  );
}

