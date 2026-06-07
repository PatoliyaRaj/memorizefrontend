'use client';

interface Card { id: string; question: string; answer: string; subTopic?: string; keep: boolean; editing: boolean; }
interface Props {
  cards: Card[];
  onToggleKeep: (id: string) => void;
  onEditCard: (id: string, key: 'question' | 'answer', val: string) => void;
  onToggleEdit: (id: string) => void;
}

export function CardSubTopicGroup({ cards, onToggleKeep, onEditCard, onToggleEdit }: Props) {
  const groups = cards.reduce((acc, c) => {
    const t = c.subTopic || 'General';
    if (!acc[t]) acc[t] = [];
    acc[t].push(c);
    return acc;
  }, {} as Record<string, Card[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([topic, topicCards]) => {
        const activeCount = topicCards.filter(c => c.keep).length;
        return (
          <details key={topic} open className="border border-slate-800 rounded-lg overflow-hidden">
            <summary className="flex justify-between items-center p-3 bg-slate-900/60 cursor-pointer hover:bg-slate-900 select-none list-none">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs transition-transform group-open:rotate-90">▶</span>
                <span className="text-sm font-semibold text-slate-200">{topic}</span>
              </div>
              <span className="text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">{activeCount} / {topicCards.length}</span>
            </summary>
            <div className="p-3 space-y-3 bg-slate-950/10">
              {topicCards.map(card => {
                const warn = card.question.length > 120 || card.answer.length > 280;
                return (
                  <div key={card.id} className={`p-4 border rounded-lg transition-all ${card.keep ? 'bg-slate-950 border-slate-800' : 'bg-slate-900/20 border-slate-900 opacity-40'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">free_recall</span>
                      <div className="flex gap-3">
                        <button onClick={() => onToggleEdit(card.id)} className="text-xs text-slate-400 hover:text-slate-200">{card.editing ? 'Done' : 'Edit'}</button>
                        <button onClick={() => onToggleKeep(card.id)} className={`text-xs font-bold ${card.keep ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>{card.keep ? 'Remove' : 'Keep'}</button>
                      </div>
                    </div>
                    {warn && card.keep && <div className="text-[10px] text-yellow-500 bg-yellow-950/20 border border-yellow-900 px-2 py-1 rounded mb-2">⚠️ Question &gt;120 or answer &gt;280 chars — consider shortening.</div>}
                    {card.editing ? (
                      <div className="space-y-2">
                        <input type="text" value={card.question} onChange={e => onEditCard(card.id, 'question', e.target.value)} placeholder="Question" className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
                        <textarea value={card.answer} onChange={e => onEditCard(card.id, 'answer', e.target.value)} placeholder="Answer" className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 h-16 resize-none focus:outline-none focus:border-indigo-500" />
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs text-slate-300">
                        <p><strong className="text-slate-100">Q:</strong> {card.question || <span className="text-red-500 italic">Empty</span>}</p>
                        <p><strong className="text-slate-100">A:</strong> {card.answer   || <span className="text-red-500 italic">Empty</span>}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
