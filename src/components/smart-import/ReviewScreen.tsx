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

interface Props {
  result:  SmartImportResponse;
  nodeId:  string;
  onBack:  () => void;
  onSaved: () => void;
}

interface ReviewCard extends ImportCard {
  id:      string;
  keep:    boolean;
  editing: boolean;
}

function getConfidenceConfig(confidence: number, method: string) {
  if (method.includes('nvidia-vision')) {
    return {
      color:  'text-emerald-400',
      bg:     'bg-emerald-950/30',
      border: 'border-emerald-800',
      label:  'Excellent',
      icon:   '🟢',
      tip:    null, // No warning needed — Vision OCR is high accuracy
    };
  }
  if (confidence >= 0.85) {
    return { color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-800', label: 'High',   icon: '🟢', tip: null };
  }
  if (confidence >= 0.65) {
    return {
      color:  'text-yellow-400',
      bg:     'bg-yellow-950/30',
      border: 'border-yellow-800',
      label:  'Medium',
      icon:   '🟡',
      tip:    'Review cards for OCR errors. Switch to "Handwritten" mode if text is cursive.',
    };
  }
  return {
    color:  'text-red-400',
    bg:     'bg-red-950/30',
    border: 'border-red-800',
    label:  'Low',
    icon:   '🔴',
    tip:    'OCR struggled with this content. Please switch to Handwritten mode or upload a clearer image.',
  };
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

export function ReviewScreen({ result, nodeId, onBack, onSaved }: Props) {
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
    type:     'definition',
    keep:     true,
    editing:  true,
  }]);

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    const keptCards = reviewCards.filter(c => c.keep && c.question.trim() && c.answer.trim());
    if (!keptCards.length) {
      setSaveError('Please keep at least one complete card before saving.');
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
          questionType: 'free_recall',
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

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800 flex-shrink-0">
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-200">← Re-upload</button>
        <h2 className="text-sm font-semibold text-slate-100">Review Imported Content</h2>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-200 text-sm" aria-label="Close">✕</button>
      </div>

      {/* Confidence Banner — only shown when there is a tip/warning */}
      {confCfg.tip && (
        <div className={`px-5 py-2.5 border-b text-xs flex items-center gap-2 ${confCfg.bg} ${confCfg.border} flex-shrink-0`}>
          <span>{confCfg.icon}</span>
          <span className={confCfg.color}>{confCfg.tip}</span>
        </div>
      )}

      {/* Main Split Panel */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — Editable Fields */}
        <div className="w-5/12 border-r border-slate-800 overflow-y-auto p-4 space-y-4 bg-slate-950/50" style={{ height: 'calc(100vh - 120px)' }}>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">Theory / Notes</label>
              <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
                {(['preview', 'edit'] as const).map(mode => (
                  <button key={mode} onClick={() => setTheoryMode(mode)}
                    className={`text-[10px] px-2 py-0.5 rounded capitalize transition-colors ${
                      theoryMode === mode
                        ? 'bg-slate-700 text-slate-100'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {theoryMode === 'edit' ? (
              <textarea value={theory} onChange={e => setTheory(e.target.value)} rows={8}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 resize-none focus:outline-none focus:border-teal-600 font-mono leading-relaxed" />
            ) : (
              <div className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 min-h-[160px] overflow-y-auto prose prose-invert prose-xs max-w-none [&_h2]:text-teal-300 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-2 [&_h2]:mb-1 [&_strong]:text-slate-100 [&_p]:mt-0.5 [&_ul]:mt-1 [&_li]:text-slate-300 [&_li]:marker:text-teal-500">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {theory || '*No theory content generated.*'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">Key Reminders</label>
              <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
                {(['preview', 'edit'] as const).map(mode => (
                  <button key={mode} onClick={() => setRememberMode(mode)}
                    className={`text-[10px] px-2 py-0.5 rounded capitalize transition-colors ${
                      rememberMode === mode
                        ? 'bg-slate-700 text-slate-100'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {rememberMode === 'edit' ? (
              <textarea value={remember} onChange={e => setRemember(e.target.value)} rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 resize-none focus:outline-none focus:border-teal-600 font-mono leading-relaxed" />
            ) : (
              <div className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 min-h-[100px] overflow-y-auto prose prose-invert prose-xs max-w-none [&_strong]:text-slate-100 [&_p]:mt-0.5 [&_ul]:mt-1 [&_li]:text-slate-300 [&_li]:marker:text-teal-500">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {remember || '*No reminders generated.*'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">Memory Anchor</label>
              {!anchor.trim() && (
                <span className="text-[10px] text-amber-500 flex items-center gap-1 font-medium animate-pulse">
                  ⚠ Not generated
                </span>
              )}
            </div>
            <textarea value={anchor} onChange={e => setAnchor(e.target.value)} rows={2}
              placeholder="No memory anchor generated. Add a real-world connection — e.g., 'Every time Netflix recommends a show, that's ML-powered tech innovation at work.'"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-teal-600 italic" />
          </div>

          {/* Telemetry / Debug Badge */}
          <div className="text-[10px] text-slate-600 space-y-0.5 pt-1">
            <p>Method: <span className="text-slate-500">{method}</span></p>
            <p>Language: <span className="text-slate-500">{result.detectedLang}</span></p>
            <p>Confidence: <span className={confCfg.color}>{Math.round(conf * 100)}% — {confCfg.label}</span></p>
            {result.pageCount && result.pageCount > 1 && (
              <p>Pages processed: <span className="text-slate-500">{result.pageCount}</span></p>
            )}
          </div>
        </div>

        {/* Right — Cards */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto p-4 space-y-3 bg-slate-950">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-slate-400">{keptCount} / {reviewCards.length} cards selected</p>
              <div className="flex gap-2">
                <button onClick={keepAll}      className="text-[10px] text-emerald-400 hover:text-emerald-300">Keep all</button>
                <button onClick={removeAll}    className="text-[10px] text-slate-500 hover:text-slate-300">Remove all</button>
                <button onClick={addBlankCard} className="text-[10px] text-teal-400 hover:text-teal-300">+ Add card</button>
              </div>
            </div>

            <CardSubTopicGroup
              cards={reviewCards}
              onToggleKeep={toggleKeep}
              onEditCard={editCard}
              onToggleEdit={toggleEdit}
            />
          </div>
          {/* Fade hint — tells user there are more cards below */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-t border-slate-800 flex-shrink-0">
        {saveError && <p className="text-xs text-red-400">{saveError}</p>}
        {!saveError && <div />}
        <button
          onClick={handleSave}
          disabled={saving || keptCount === 0}
          className="bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm px-6 py-2 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : `Save Node + ${keptCount} Card${keptCount !== 1 ? 's' : ''} →`}
        </button>
      </div>
    </div>
  );
}
