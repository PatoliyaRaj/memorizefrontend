'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { BookOpen, Pin, Brain, X } from 'lucide-react';

interface ZenReaderModalProps {
  nodeTitle: string;
  theoryContent: string;
  thingsToRemember?: string;
  emotionalAnchor?: string;
  onClose: () => void;
}

export function ZenReaderModal({
  nodeTitle,
  theoryContent,
  thingsToRemember,
  emotionalAnchor,
  onClose,
}: ZenReaderModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-void/90 backdrop-blur-md p-4 md:p-8 transition-opacity duration-300">
      <div className="bg-surface-void border border-border-default rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-shadow-lg overflow-hidden transition-all duration-300 font-body">
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-border-default bg-surface-base/30 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary w-4.5 h-4.5" />
            <h1 className="text-base font-display font-bold text-text-primary tracking-wide">{nodeTitle}</h1>
            <span className="text-[9px] text-primary bg-primary/10 border border-border-brand px-2 py-0.5 rounded-full font-mono font-semibold uppercase tracking-wider">
              Zen Mode
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-primary text-xs bg-surface-hover p-1.5 px-3 rounded-lg border border-border-default transition-all flex items-center gap-1.5 cursor-pointer font-mono"
          >
            <X className="w-3.5 h-3.5" /> Exit Reader
          </button>
        </header>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
          
          {/* Main Theory Block */}
          {theoryContent ? (
            <article className="prose prose-invert prose-base max-w-none leading-relaxed 
                                [&_h2]:text-primary [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-border-default [&_h2]:pb-1
                                [&_h3]:text-text-primary [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1
                                [&_strong]:text-text-primary [&_p]:text-text-secondary [&_p]:mb-4
                                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-text-secondary [&_li]:marker:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {theoryContent}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center text-text-tertiary py-10 font-mono">No notes written for this concept yet.</div>
          )}

          {/* Key Reminders Block */}
          {thingsToRemember && thingsToRemember.trim() && (
            <section className="bg-surface-raised border border-border-default rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5" /> Key Reminders & Takeaways
              </h2>
              <div className="prose prose-invert prose-sm max-w-none 
                              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-text-secondary [&_li]:marker:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {thingsToRemember}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {/* Emotional Anchor Block */}
          {emotionalAnchor && emotionalAnchor.trim() && (
            <section className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-5 space-y-2">
              <h2 className="text-xs font-mono font-bold text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Neurological Memory Anchor
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed italic pl-3 border-l-2 border-tertiary/30">
                {emotionalAnchor}
              </p>
            </section>
          )}

        </div>

        {/* Footer info bar */}
        <footer className="px-6 py-3 border-t border-border-default bg-[#0A0F0E] text-[10px] text-text-tertiary flex justify-between items-center flex-shrink-0 font-mono">
          <span>Close your eyes, visualize the structure of this concept before beginning flashcard practice.</span>
          <span>Vidyarc Platform</span>
        </footer>

      </div>
    </div>
  );
}
