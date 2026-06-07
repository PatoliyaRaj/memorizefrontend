'use client';
import { useState } from 'react';
import { CardSubTopicGroup } from './CardSubTopicGroup';
import { confirmImport } from '@/services/import-service';
import type { SmartImportPayload } from '@/services/import-service';

interface Props { result: SmartImportPayload; nodeId: string; nodeTitle: string; onBack: () => void; onSaved: () => void; }

export function ReviewScreen({ result, nodeId, nodeTitle, onBack, onSaved }: Props) {
  const [fields, setFields] = useState(result.fields);
  const [cards, setCards] = useState(
    result.cards.map((c, i) => ({ ...c, id: `gen-${i}`, keep: true, editing: false }))
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const kept = cards.filter(c => c.keep);

  function toggleKeep(id: string) { setCards(p => p.map(c => c.id === id ? { ...c, keep: !c.keep } : c)); }
  function editCard(id: string, key: 'question' | 'answer', val: string) { setCards(p => p.map(c => c.id === id ? { ...c, [key]: val } : c)); }
  function toggleEdit(id: string) { setCards(p => p.map(c => c.id === id ? { ...c, editing: !c.editing } : c)); }
  function addCard() { setCards(p => [...p, { id: `manual-${Date.now()}`, question: '', answer: '', subTopic: 'General', explanation: '', type: 'definition', keep: true, editing: true }]); }

  async function save() {
    setSaving(true); setSaveError(null);
    try {
      await confirmImport({
        nodeId, fields,
        cards: kept.map(({ question, answer, subTopic, explanation }) => ({ question, answer, questionType: 'free_recall', subTopic, explanation })),
      });
      onSaved();
    } catch (e: any) { setSaveError(e.message || 'Save failed.'); }
    finally { setSaving(false); }
  }

  const confColor = result.confidence > 0.8 ? 'text-green-400' : result.confidence > 0.6 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
        <div>
          <h2 className="font-bold text-slate-100 text-base">Review — {nodeTitle}</h2>
          <div className="flex gap-4 mt-0.5">
            <span className="text-xs text-slate-500">Method: <strong className="text-indigo-400">{result.method}</strong></span>
            <span className="text-xs text-slate-500">Language: <strong className="text-indigo-400 uppercase">{result.detectedLang}</strong></span>
            <span className="text-xs text-slate-500">Confidence: <strong className={confColor}>{Math.round(result.confidence * 100)}%</strong></span>
          </div>
        </div>
        <button onClick={onBack} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">← Re-upload</button>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Fields */}
        <div className="w-1/2 overflow-y-auto p-5 border-r border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Extracted Content</h3>
          {[
            { label: 'Theory Content', key: 'theoryContent' as const, rows: 8 },
            { label: 'Things to Remember', key: 'thingsToRemember' as const, rows: 5 },
            { label: 'Emotional Anchor (optional)', key: 'emotionalAnchor' as const, rows: 3 },
          ].map(({ label, key, rows }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">{label}</label>
              <textarea
                rows={rows}
                value={(fields as any)[key] || ''}
                onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          ))}
        </div>

        {/* Right: Cards */}
        <div className="w-1/2 overflow-y-auto p-5 bg-slate-950/20 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-200">Flashcards <span className="text-indigo-400 font-normal">({kept.length} selected)</span></h3>
            <div className="flex gap-3">
              <button onClick={() => setCards(p => p.map(c => ({ ...c, keep: true  })))} className="text-xs text-green-400 hover:text-green-300">Keep All</button>
              <button onClick={() => setCards(p => p.map(c => ({ ...c, keep: false })))} className="text-xs text-red-400 hover:text-red-300">Remove All</button>
              <button onClick={addCard} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">+ Add Card</button>
            </div>
          </div>
          <CardSubTopicGroup cards={cards} onToggleKeep={toggleKeep} onEditCard={editCard} onToggleEdit={toggleEdit} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
        {saveError ? <span className="text-xs text-red-400">{saveError}</span>
          : <span className="text-xs text-slate-400">Will write <strong className="text-indigo-400">{kept.length} cards</strong> + node content to database.</span>}
        <div className="flex gap-3">
          <button onClick={onBack} disabled={saving} className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm disabled:opacity-50">Back</button>
          <button onClick={save} disabled={saving || (kept.length === 0 && !fields.theoryContent?.trim())}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-sm font-semibold shadow transition-colors">
            {saving ? 'Saving…' : `Save Node + ${kept.length} Cards →`}
          </button>
        </div>
      </div>
    </div>
  );
}
